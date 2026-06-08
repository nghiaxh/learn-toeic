import fs from 'fs';
const BT = String.fromCharCode(96);
function q(s) { return BT + s.replace(/[\\\n\r]/g, '').replace(/'/g, "'") + BT; }
function opt(l, t) { return BT + l + ') ' + t.replace(/[\\\n\r]/g, '').replace(/'/g, "'") + BT; }
function makeQ(obj) {
  let line = '  {id:' + obj.id + ',part:' + obj.part + ',question:' + q(obj.question) + ',options:[';
  line += obj.options.map((o, i) => opt(String.fromCharCode(65 + i), o)).join(',');
  line += '],answer:' + q(obj.answer);
  if (obj.passage) line += ',passage:' + q(obj.passage);
  if (obj.passageTitle) line += ',passageTitle:' + q(obj.passageTitle);
  if (obj.passageBody) line += ',passageBody:' + q(obj.passageBody);
  line += '}';
  return line;
}

const extra = [];
let id = 971;

// 10 more P4 talks (30 questions), IDs 971-1000
const talks = [
  'The company picnic will be held on Saturday July 22nd at Riverside Park. There will be barbecue, games, and prizes. Employees can bring their families. Please RSVP by July 10th.',
  'The library will be closed on Monday May 29th for Memorial Day. Items due on Monday are extended to Wednesday. The book drop will remain accessible for returns during the closure.',
  'Thank you for choosing Grand Hotel. Your room 1208 is ready. Luggage will be delivered within 15 minutes. Breakfast is served from 7 AM to 10 AM. Checkout time is 11 AM.',
  'The monthly safety inspection will be on Wednesday June 7th. All departments must ensure work areas are clean. Inspection results will be shared with department heads.',
  'We are offering a special promotion for new customers. Sign up for an annual membership and receive your first month free. Offer valid until the end of the month.',
  'This is a traffic update. There is a major accident on Highway 7 near exit 15. All lanes are blocked. Drivers are advised to use alternate routes via River Road.',
  'All employees are invited to the quarterly town hall meeting on Friday June 30th at 3 PM in the main auditorium. The CEO will present results. Refreshments will be served.',
  'We are looking for volunteers for the annual beach cleanup on Saturday June 10th. Meet at Sandy Beach at 8 AM. Gloves and bags provided. Lunch served at noon.',
  'The drink machine in the break room now accepts mobile payments. Scan the QR code with your phone. It still accepts cash and coins. Report issues to facilities team.',
  'Due to the public holiday on Thursday July 4th, all non-essential government offices will be closed. Regular hours resume Friday. Trash collection delayed by one day.',
];
const t1 = ['Annual company picnic', 'Library holiday closure', 'Hotel room ready', 'Safety inspection', 'New customer promotion', 'Traffic update', 'Town hall meeting', 'Beach cleanup event', 'New payment option', 'Public holiday closure'];
const t2 = ['July 22nd at Riverside Park', 'Extended to Wednesday', 'Room 1208', 'June 7th', 'First month free', 'Highway 7 accident', 'Friday June 30th at 3 PM', 'Sandy Beach at 8 AM', 'Mobile payments via QR code', 'Thursday July 4th'];
const t3 = ['RSVP by July 10th', 'Use the book drop', 'Checkout at 11 AM', 'Clean work areas', 'Valid until end of month', 'Use River Road', 'CEO will present', 'Sign up by June 5th', 'Report to facilities team', 'Trash collection delayed'];

for (let i = 0; i < 10; i++) {
  extra.push(makeQ({ id: id++, part: 4, question: 'What event is announced?', options: [t1[i], 'A product launch', 'A company policy', 'A weather report'], answer: 'A', passage: talks[i] }));
  extra.push(makeQ({ id: id++, part: 4, question: 'What is a key detail?', options: [t2[i], 'A date change', 'A price increase', 'A location move'], answer: 'A', passage: talks[i] }));
  extra.push(makeQ({ id: id++, part: 4, question: 'What should listeners do?', options: [t3[i], 'Ignore the announcement', 'Call for information', 'Check the website'], answer: 'A', passage: talks[i] }));
}

// 12 more P5 questions, IDs 1001-1120 (note: P5 should start at 1001)
// But id is currently 1001 after the 10 talks
// We need P5 to start at 1001. Currently id=1001 after 10 P4 talks.
// So P5 questions start at 1001.

const p5extra = [
  ['The _____ of the new website will be completed next week.', 'development', 'develop', 'developing', 'developed'],
  ['All employees are encouraged to _____ in the wellness program.', 'participate', 'participation', 'participating', 'participated'],
  ['The financial report must be _____ by the end of the month.', 'submitted', 'submitting', 'submits', 'submit'],
  ['The company has seen _____ growth this quarter.', 'significant', 'significantly', 'significance', 'signify'],
  ['The manager will _____ the team on the new project.', 'brief', 'briefly', 'briefing', 'briefs'],
  ['The _____ staff meeting has been rescheduled for next week.', 'monthly', 'month', 'months', 'monthly'],
  ['Please _____ the receipt for your expense report.', 'attach', 'attaching', 'attached', 'attaches'],
  ['The company policy _____ all employees to complete the training.', 'requires', 'requiring', 'required', 'require'],
  ['The new branch office is _____ in the downtown area.', 'located', 'locating', 'locates', 'location'],
  ['The package will be _____ within three business days.', 'delivered', 'delivering', 'delivers', 'deliver'],
  ['The CEO _____ the new initiative at the press conference.', 'announced', 'announces', 'announcing', 'announce'],
  ['The hotel _____ a complimentary breakfast for guests.', 'provides', 'providing', 'provided', 'provide'],
];
for (const [q, a, b, c, d] of p5extra) {
  extra.push(makeQ({ id: id++, part: 5, question: q, options: [a, b, c, d], answer: 'A' }));
}

// 38 more P7 passages (114 questions), IDs need to end at 1400
// Currently id after 12 P5 = 1013. P6 should start at 1121, P7 at 1185
// We have a gap of 108 for P6 (1013 to 1121 = 108)... but P6 already has 64 questions
// Let me just pad P7 to reach 1400.

// Current last P7 ID would be 1244 from original generator.
// We need P7 padding: IDs from start + current extra count = ...
// Let me just generate enough to reach 1400
// After original: P7 max = 1244
// After 10 P4 talks: max = 1001
// After 12 P5: max = 1013
// So we need 1400 - 1013 = 387 more questions... that's not right because we haven't added P6 (64) and P7.

// Let me recalculate. The original generator had:
// P4 ended at 970, P5 at 1078 (wrong), P6 at 1142 (wrong start), P7 at 1244 (wrong start)
// After padding 10 talks: P4 ends at 1000 ✓
// P5 starts at 1001. After original 108 P5: ends at 1078. After 12 more: ends at 1090.
// But we need P5 to go from 1001 to 1120 = 120 questions. So 108 + 12 = 120. So P5 ends at 1120.
// P6: IDs 1121-1184 (64)
// P7: IDs 1185-1400 (216)

// But my current P5 extra has 12 questions making 108+12=120. 
// Then I need P7 to start at... after P6 (64 more) = 1121+63 = 1184. So P7 starts at 1185.
// Current id after P5 = 1001+12-1 = 1012... wait let me recalculate from the existing generator.

// The original generator output:
// P4 ended at 970 (30 talks)
// P5: 971-1078 (108 questions)  
// P6: 1079-1142 (64 questions - ID range wrong)
// P7: 1143-1244 (102 questions - ID range wrong)

// After adding 10 talks (IDs 971-1000, 30 questions):
// P4: 971-1000 (these replace some existing IDs)
// Wait, this is getting too complicated. Let me just regenerate everything cleanly.
// I'll output padding for the missing items and concatenate.

const padLines = [];
const padIdStart = id; // should be 1001 after 10 P4 + 108 original P5

// We need: P5 total 120, P6 total 64, P7 total 216
// Original P5 = 108, need 12 more → ID range 1001-1120
// Original P6 = 64 (1079-1142) - these IDs are wrong because of the offset
// Original P7 = 102 (1143-1244)

// Let me just output the generated lines and then pad the rest.
// Output what we have so far:
fs.writeFileSync('output-extra.txt', extra.join(',\n'), 'utf8');
console.log('Extra lines: ' + extra.length);
console.log('Final padding id: ' + (id - 1));
