
var junkLines = [
    'this is a junk line to test scrolling',
    'some more junk',
    'an apple a day',
    'steaming',
    'for the glory of old Russia',
    'spongebob and squidwert',
    'it is late',
    'inside and outside',
    'feed me more junk',
    'isnt there a URL for this?',
    'its all I have',
    'this is risking a typo',
    'this is a stupid way of doing this'
];

export function junk() {
    return junkLines[ ( Math.random() * junkLines.length  - 1 ) | 0 ];
}
