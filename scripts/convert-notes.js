const fs = require('fs');
const firebase = require('firebase');
const {GeoPoint, Timestamp} = firebase.firestore;

const args = process.argv;
const [notePath, mapId, uid] = args.slice(2);

const notes = [
    {
        id: 'N1ecl2-re',
        content: 'Foo bar foo foo doo doo dee doo',
        position: {lat: 40.75522611259727, lng: -73.9161416888237}
    }
];

function convertNote(note) {
    const {
        content,
        position: {lat, lng}
    } = note;
    return {
        createdAt: new Timestamp((Date.now() / 1000) | 0),
        createdBy: uid,
        location: new GeoPoint(lat, lng),
        message: content,
        mapId
    };
}

const convertedNotes = notes.map(convertNote);

fs.writeFile(
    'new-notes.json',
    JSON.stringify(convertedNotes),
    'utf8',
    () => {}
);
