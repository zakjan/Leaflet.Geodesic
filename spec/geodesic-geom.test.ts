import { GeodesicGeometry } from "../src/geodesic-geom";
import { expect } from "chai";

import L from "leaflet";

import "jest";

const Berlin: L.LatLngLiteral = { lat: 52.5, lng: 13.35 };
const Seattle: L.LatLngLiteral = { lat: 47.56, lng: -122.33 };
const Capetown: L.LatLngLiteral = { lat: -33.94, lng: 18.39 };
const Tokyo: L.LatLngLiteral = { lat: 35.47, lng: 139.15 };
const Sydney: L.LatLngLiteral = { lat: -33.91, lng: 151.08 };

const SeattleCapetown3: L.LatLngLiteral[] = [
    { lat: 47.56, lng: -122.33 },
    { lat: 18.849527, lng: -35.885828 },
    { lat: -33.94, lng: 18.39 }
];

const SeattleCapetown5: L.LatLngLiteral[] = [
    { lat: 47.56, lng: -122.33 },
    { lat: 41.580847, lng: -70.162019 },
    { lat: 18.849527, lng: -35.885828 },
    { lat: -8.461111, lng: -10.677708 },
    { lat: -33.94, lng: 18.39 }
];

const geom = new GeodesicGeometry();
const eps = 0.000001;

describe("recursiveMidpoint method", function () {
    it("Seatle to Capetown, zero iterations (just the midpoint)", function () {
        const n = 0;
        const line = geom.recursiveMidpoint(Seattle, Capetown, n);
        expect(line).to.be.an("array");
        expect(line).to.be.length(1 + 2 ** (n + 1));    // 3
        line.forEach((point, index) => {
            expect(point).to.be.an("object");
            expect(point).to.include.all.keys("lat", "lng");
            expect(point.lat).to.be.closeTo(SeattleCapetown3[index].lat, eps);
            expect(point.lng).to.be.closeTo(SeattleCapetown3[index].lng, eps);
        })
    });

    it("Seatle to Capetown, one iteration", function () {
        const n = 1;
        const line = geom.recursiveMidpoint(Seattle, Capetown, n);
        expect(line).to.be.an("array");
        expect(line).to.be.length(1 + 2 ** (n + 1));    // 5
        line.forEach((point, index) => {
            expect(point).to.be.an("object");
            expect(point).to.include.all.keys("lat", "lng");
            expect(point.lat).to.be.closeTo(SeattleCapetown5[index].lat, eps);
            expect(point.lng).to.be.closeTo(SeattleCapetown5[index].lng, eps);
        })
    });

    it("Seatle to Capetown, 2 iteration", function () {
        const n = 2;
        const line = geom.recursiveMidpoint(Seattle, Capetown, n);
        expect(line).to.be.an("array");
        expect(line).to.be.length(1 + 2 ** (n + 1));    // 9
    });

    it("Seatle to Capetown, 3 iteration", function () {
        const n = 3;
        const line = geom.recursiveMidpoint(Seattle, Capetown, n);
        expect(line).to.be.an("array");
        expect(line).to.be.length(1 + 2 ** (n + 1));    // 17
    });

    it("Seatle to Capetown, 10 iteration", function () {
        const n = 10;
        const line = geom.recursiveMidpoint(Seattle, Capetown, n);
        expect(line).to.be.an("array");
        expect(line).to.be.length(1 + 2 ** (n + 1));    // 2049
    });
});

describe("line function", function () {
    it("Berlin, Seattle", function () {
        const line = geom.line(Berlin, Seattle);
        expect(line).to.be.an("array");
    });
});

describe("linestring function", function () {
    it("Berlin, Seattle, Capetown", function () {
        const line = geom.lineString([Berlin, Seattle, Capetown]);
        expect(line).to.be.an("array");
    });
});

describe("multilinestring function", function () {
    it("Berlin, Seattle, Capetown", function () {
        const line = geom.multiLineString([[Berlin, Seattle, Capetown]]);
        expect(line).to.be.an("array");
    });
});

describe("splitLine function", function () {

    it("Berlin -> Seattle (no split)", function () {
        const fixture: L.LatLngLiteral[][] = [[Berlin, Seattle]];
        const split = geom.splitLine(Berlin, Seattle);
        expect(split).to.be.an("array");
        expect(split).to.be.length(fixture.length);
        split.forEach((line, k) => {
            expect(line).to.be.length(fixture[k].length);
            line.forEach((point, l) => {
                expect(point).to.be.an("object");
                expect(point).to.include.all.keys("lat", "lng");
                expect(point.lat).to.be.closeTo(fixture[k][l].lat, eps);
                expect(point.lng).to.be.closeTo(fixture[k][l].lng, eps);
            });
        });
    });

    it("Seattle -> Berlin (no split)", function () {
        const fixture: L.LatLngLiteral[][] = [[Seattle, Berlin]];
        const split = geom.splitLine(Seattle, Berlin);
        expect(split).to.be.an("array");
        expect(split).to.be.length(fixture.length);
        split.forEach((line, k) => {
            expect(line).to.be.length(fixture[k].length);
            line.forEach((point, l) => {
                expect(point).to.be.an("object");
                expect(point).to.include.all.keys("lat", "lng");
                expect(point.lat).to.be.closeTo(fixture[k][l].lat, eps);
                expect(point.lng).to.be.closeTo(fixture[k][l].lng, eps);
            });
        });
    });

    it("Berlin -> Sydney (no split)", function () {
        const fixture: L.LatLngLiteral[][] = [[Berlin, Sydney]];
        const split = geom.splitLine(Berlin, Sydney);
        expect(split).to.be.an("array");
        expect(split).to.be.length(fixture.length);
        split.forEach((line, k) => {
            expect(line).to.be.length(fixture[k].length);
            line.forEach((point, l) => {
                expect(point).to.be.an("object");
                expect(point).to.include.all.keys("lat", "lng");
                expect(point.lat).to.be.closeTo(fixture[k][l].lat, eps);
                expect(point.lng).to.be.closeTo(fixture[k][l].lng, eps);
            });
        });
    });

    it("Seattle -> Tokyo", function () {
        const fixture: L.LatLngLiteral[][] = [  // verified with QGIS
            [Seattle, { lat: 53.130876, lng: -180 }],
            [{ lat: 53.130876, lng: 180 }, Tokyo]
        ];
        const split = geom.splitLine(Seattle, Tokyo);
        expect(split).to.be.an("array");
        expect(split).to.be.length(fixture.length);
        split.forEach((line, k) => {
            expect(line).to.be.length(fixture[k].length);
            line.forEach((point, l) => {
                expect(point).to.be.an("object");
                expect(point).to.include.all.keys("lat", "lng");
                expect(point.lat).to.be.closeTo(fixture[k][l].lat, eps);
                expect(point.lng).to.be.closeTo(fixture[k][l].lng, eps);
            });
        });
    });

    it("Tokyo -> Seattle", function () {
        const fixture: L.LatLngLiteral[][] = [  // verified with QGIS
            [Tokyo, { lat: 53.095949, lng: 180 }],
            [{ lat: 53.095949, lng: -180 }, Seattle]
        ];
        const split = geom.splitLine(Tokyo, Seattle);
        expect(split).to.be.an("array");
        expect(split).to.be.length(fixture.length);
        split.forEach((line, k) => {
            expect(line).to.be.length(fixture[k].length);
            line.forEach((point, l) => {
                expect(point).to.be.an("object");
                expect(point).to.include.all.keys("lat", "lng");
                expect(point.lat).to.be.closeTo(fixture[k][l].lat, eps);
                expect(point.lng).to.be.closeTo(fixture[k][l].lng, eps);
            });
        });
    });

    it("Over Southpole (no split)", function () {
        const fixture: L.LatLngLiteral[][] = [
            [{ lat: -76.92061351829682, lng: -24.257812500000004 }, { lat: -90, lng: 155.641042 }],
            [{ lat: -90, lng: 155.641042 }, { lat: -72.28906720017675, lng: 155.7421875 }]
        ];
        const split = geom.splitLine({ lat: -76.92061351829682, lng: -24.257812500000004 }, { lat: -72.28906720017675, lng: 155.7421875 });
        expect(split).to.be.an("array");
        expect(split).to.be.length(fixture.length);
        split.forEach((line, k) => {
            expect(line).to.be.length(fixture[k].length);
            line.forEach((point, l) => {
                expect(point).to.be.an("object");
                expect(point).to.include.all.keys("lat", "lng");
                expect(point.lat).to.be.closeTo(fixture[k][l].lat, eps);
                expect(point.lng).to.be.closeTo(fixture[k][l].lng, eps);
            });
        });
    });
});


describe("splitMultiLineString function", function () {

    it("Berlin -> Seattle (no split)", function () {
        const geodesic: L.LatLngLiteral[][] = [geom.recursiveMidpoint(Berlin, Seattle, 1)];
        const split = geom.splitMultiLineString(geodesic);
        expect(split).to.be.an("array");
        expect(split).to.be.length(1);
        split.forEach((line, k) => {
            expect(line).to.be.length(geodesic[0].length);
            line.forEach((point, l) => {
                expect(point).to.be.an("object");
                expect(point).to.include.all.keys("lat", "lng");
                expect(point.lat).to.be.closeTo(geodesic[k][l].lat, eps);
                expect(point.lng).to.be.closeTo(geodesic[k][l].lng, eps);
            });
        });
    });

    it("Berlin -> Los Angeles (higher resolution, no split)", function () {
        const geodesic: L.LatLngLiteral[][] = [geom.recursiveMidpoint(Berlin, {lat: 32.54681317351517, lng: -118.82812500000001}, 2)];
        const split = geom.splitMultiLineString(geodesic);
        expect(split).to.be.an("array");
        expect(split).to.be.length(1);
        split.forEach((line, k) => {
            expect(line).to.be.length(geodesic[0].length);
            line.forEach((point, l) => {
                expect(point).to.be.an("object");
                expect(point).to.include.all.keys("lat", "lng");
                expect(point.lat).to.be.closeTo(geodesic[k][l].lat, eps);
                expect(point.lng).to.be.closeTo(geodesic[k][l].lng, eps);
            });
        });
    });


    it("Seattle -> Tokyo", function () {
        const fixture: L.LatLngLiteral[][] = [
            [
                { lat: 47.56, lng: -122.33 },
                { lat: 53.86920734446313, lng: -148.18981326309986 },
                { lat: 53.438428643246105, lng: -177.80102713286155 },
                { lat: 53.105220539910135, lng: -179.99999999998232 }],
            [
                { lat: 53.105220539910135, lng: 180.00000000001768 },
                { lat: 46.47098438753966, lng: 157.17353392461567 },
                { lat: 35.47, lng: 139.15 }]];

        const geodesic: L.LatLngLiteral[][] = [geom.recursiveMidpoint(Seattle, Tokyo, 1)];
        const split = geom.splitMultiLineString(geodesic);
        expect(split).to.be.an("array");
        expect(split).to.be.length(fixture.length);
        split.forEach((line, k) => {
            expect(line).to.be.length(fixture[k].length);
            line.forEach((point, l) => {
                expect(point).to.be.an("object");
                expect(point).to.include.all.keys("lat", "lng");
                expect(point.lat).to.be.closeTo(fixture[k][l].lat, eps);
                expect(point.lng).to.be.closeTo(fixture[k][l].lng, eps);
            });
        });
    });

    it("Tokyo -> Seattle", function () {
        const fixture: L.LatLngLiteral[][] = [
            [
                { lat: 35.47, lng: 139.15 },
                { lat: 46.470984387539666, lng: 157.17353392461575 },
                { lat: 53.08741200357901, lng: 179.99999999999866 }],
            [
                { lat: 53.08741200357901, lng: -180.00000000000134 },
                { lat: 53.438428643246105, lng: -177.80102713286158 },
                { lat: 53.86920734446313, lng: -148.18981326309986 },
                { lat: 47.56, lng: -122.33 }]];

        const geodesic: L.LatLngLiteral[][] = [geom.recursiveMidpoint(Tokyo, Seattle, 1)];
        const split = geom.splitMultiLineString(geodesic);
        expect(split).to.be.an("array");
        expect(split).to.be.length(fixture.length);
        split.forEach((line, k) => {
            expect(line).to.be.length(fixture[k].length);
            line.forEach((point, l) => {
                expect(point).to.be.an("object");
                expect(point).to.include.all.keys("lat", "lng");
                expect(point.lat).to.be.closeTo(fixture[k][l].lat, eps);
                expect(point.lng).to.be.closeTo(fixture[k][l].lng, eps);
            });
        });
    });

});