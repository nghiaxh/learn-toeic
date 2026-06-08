import fs from 'fs';
const bt = String.fromCharCode(96);

const lines = fs.readFileSync('output-lines.txt','utf8').split('\n').filter(l=>l.trim());
const out = [];

// Helper to replace id:N with id:M
function setId(line, newId) {
  return line.replace(/id:\d+/, 'id:' + newId);
}

// Track IDs
let id = 601;

// P1: 24 (601-624)
let i = 0;
for (; i < 24; i++) {
  out.push(setId(lines[i], id++));
}

// P2: 100 (625-724)
for (; i < 124; i++) {
  out.push(setId(lines[i], id++));
}

// P3: 156 (725-880)
for (; i < 280; i++) {
  out.push(setId(lines[i], id++));
}

// P4: 90 original + 30 new (881-1000)
for (; i < 370; i++) {
  out.push(setId(lines[i], id++));
}

// --- Add 10 more P4 talks (3 questions each) ---
const p4Topics = [
  {title:`Welcome to the annual company picnic`,detail:`Food and drinks will be provided. There will be games and activities for all ages. The picnic will be held at Riverside Park on Saturday from 11 AM to 4 PM.`,q1:`Where will the picnic be held?`,a1:`A`,q2:`What time does the picnic start?`,a2:`A`,q3:`What will be provided?`,a3:`A`},
  {title:`The monthly safety training`,detail:`All employees must attend. The training covers emergency procedures and fire evacuation routes. It will be held in the main auditorium at 3 PM.`,q1:`Who must attend the training?`,a1:`A`,q2:`What is covered in the training?`,a2:`A`,q3:`Where is the training?`,a3:`A`},
  {title:`New parking regulations`,detail:`Starting next month, parking in the west lot will require a permit. Permits can be obtained from the security office. Visitors should park in the east lot.`,q1:`When do the new regulations take effect?`,a1:`A`,q2:`Where can permits be obtained?`,a2:`A`,q3:`Where should visitors park?`,a3:`A`},
  {title:`The quarterly financial results`,detail:`Our company has seen a 15 percent increase in revenue this quarter. Operating costs have been reduced. The full report is available on the company intranet.`,q1:`What is the percentage increase in revenue?`,a1:`A`,q2:`What has been reduced?`,a2:`A`,q3:`Where is the full report?`,a3:`A`},
  {title:`Customer feedback survey`,detail:`We value your opinion. Please complete the customer feedback survey available at the front desk. The survey takes about five minutes. Participants will be entered into a drawing for a gift card.`,q1:`Where is the survey available?`,a1:`A`,q2:`How long does the survey take?`,a2:`A`,q3:`What is the prize for participants?`,a3:`A`},
  {title:`Weekend maintenance work`,detail:`The office building will undergo maintenance this weekend. Water will be shut off from Saturday midnight to Sunday 6 AM. Elevators will be operational as usual.`,q1:`When will the water be shut off?`,a1:`A`,q2:`What will be operational?`,a2:`A`,q3:`What is the reason for the work?`,a3:`A`},
  {title:`Annual health fair`,detail:`The annual health fair will take place in the cafeteria on Wednesday. Free health screenings will be offered. There will also be nutrition workshops and fitness demonstrations.`,q1:`Where is the health fair?`,a1:`A`,q2:`What will be offered for free?`,a2:`A`,q3:`What else will be at the fair?`,a3:`A`},
  {title:`Retirement party announcement`,detail:`Please join us in celebrating the retirement of Mr. Tanaka after 30 years of service. The party will be held in the banquet hall on Friday at 6 PM.`,q1:`Who is retiring?`,a1:`A`,q2:`How many years did he work?`,a2:`A`,q3:`Where is the party?`,a3:`A`},
  {title:`Shipping department update`,detail:`The shipping department will now use a new tracking system. All packages must be logged before 3 PM for same-day dispatch. Training sessions will be held this week.`,q1:`What is new in the shipping department?`,a1:`A`,q2:`What is the deadline for same-day dispatch?`,a2:`A`,q3:`When are the training sessions?`,a3:`A`},
  {title:`Office cleaning schedule`,detail:`The office will be cleaned every Tuesday and Thursday evening. Please ensure all personal items are stored away. Any items left on desks may be moved to the lost and found.`,q1:`How often is the office cleaned?`,a1:`A`,q2:`What should employees do with personal items?`,a2:`A`,q3:`Where will left items be moved?`,a3:`A`},
];

for (const t of p4Topics) {
  out.push(`  {id:${id++},part:4,question:${bt}What is the announcement about?${bt},options:[${bt}A) ${t.title}${bt},${bt}B) A product launch${bt},${bt}C) A company policy${bt},${bt}D) A weather report${bt}],answer:${bt}${t.a1}${bt},passage:${bt}${t.detail}${bt}},`);
  out.push(`  {id:${id++},part:4,question:${bt}${t.q1}${bt},options:[${bt}A) ${t.detail.split('.')[0]}${bt},${bt}B) A date change${bt},${bt}C) A price increase${bt},${bt}D) A location move${bt}],answer:${bt}${t.a2}${bt},passage:${bt}${t.detail}${bt}},`);
  out.push(`  {id:${id++},part:4,question:${bt}${t.q3}${bt},options:[${bt}A) ${t.detail.split('. ').slice(1,2).join('')}${bt},${bt}B) Ignore the announcement${bt},${bt}C) Call for more information${bt},${bt}D) Check the website${bt}],answer:${bt}${t.a3}${bt},passage:${bt}${t.detail}${bt}},`);
}

// P5: 108 original shifted from 971-1078 to 1001-1108
for (; i < 478; i++) {
  out.push(setId(lines[i], id++));
}

// Add 12 more P5 questions (IDs 1109-1120)
const p5Extra = [
  {q:`The conference room has been _____ for the afternoon meeting.`,o:[`A) reserved`,`B) reserving`,`C) reserves`,`D) reserve`],a:`A`},
  {q:`Please make sure all invoices are _____ before the end of the month.`,o:[`A) processed`,`B) processing`,`C) process`,`D) processes`],a:`A`},
  {q:`The training program was _____ designed for new employees.`,o:[`A) specifically`,`B) specific`,`C) specify`,`D) specifies`],a:`A`},
  {q:`_____ the merger, the company will expand into new markets.`,o:[`A) Following`,`B) Followed`,`C) Follows`,`D) Follow`],a:`A`},
  {q:`The technician will _____ the equipment tomorrow morning.`,o:[`A) inspect`,`B) inspecting`,`C) inspected`,`D) inspection`],a:`A`},
  {q:`All employees are encouraged to _____ in the wellness program.`,o:[`A) participate`,`B) participation`,`C) participating`,`D) participates`],a:`A`},
  {q:`The package was _____ via express delivery service.`,o:[`A) shipped`,`B) shipping`,`C) ships`,`D) ship`],a:`A`},
  {q:`The new software is _____ with all existing systems.`,o:[`A) compatible`,`B) compatibility`,`C) compatibly`,`D) compatibilize`],a:`A`},
  {q:`Applicants must submit their documents _____ the deadline.`,o:[`A) before`,`B) after`,`C) during`,`D) until`],a:`A`},
  {q:`The annual report provides a detailed _____ of company performance.`,o:[`A) analysis`,`B) analyze`,`C) analyzing`,`D) analytical`],a:`A`},
  {q:`The manager asked for the budget proposal to be _____ by Friday.`,o:[`A) completed`,`B) completing`,`C) completes`,`D) complete`],a:`A`},
  {q:`Mr. Chen has been _____ with the company for over a decade.`,o:[`A) employed`,`B) employing`,`C) employs`,`D) employ`],a:`A`},
];

for (const q of p5Extra) {
  out.push(`  {id:${id++},part:5,question:${bt}${q.q}${bt},options:[${q.o.map((o,i)=>`${bt}${o}${bt}`).join(',')}],answer:${bt}${q.a}${bt}},`);
}

// P6: 64 original shifted from 1079-1142 to 1121-1184
for (; i < 542; i++) {
  out.push(setId(lines[i], id++));
}

// P7: 102 original shifted from 1143-1244 to 1185-1286
for (; i < 644; i++) {
  out.push(setId(lines[i], id++));
}

// --- Add 38 more P7 passages (3 questions each = 114 Qs), IDs 1287-1400 ---
const p7Extra = [
  {title:`Green Office Initiative`,body:`As part of our commitment to sustainability, we are launching the Green Office Initiative. Starting next month, all departments are required to recycle paper, plastic, and glass. Recycling bins will be placed on every floor. Please also turn off lights and computers at the end of each day.`,
   q:[{q:`What is the purpose of this announcement?`,o:[`A) To launch a new sustainability program`,`B) To announce a company party`,`C) To introduce new employees`,`D) To change office hours`],a:`A`},
      {q:`What are employees asked to do?`,o:[`A) Recycle materials`,`B) Work longer hours`,`C) Attend a training`,`D) Submit reports`],a:`A`},
      {q:`Where will recycling bins be placed?`,o:[`A) On every floor`,`B) In the cafeteria`,`C) Outside the building`,`D) In the parking lot`],a:`A`}]},
  {title:`IT System Maintenance`,body:`The IT department will perform system maintenance this Saturday from 8 PM to midnight. During this time, email and file servers will be unavailable. Please save all your work and log out before leaving on Friday. We apologize for any inconvenience.`,
   q:[{q:`When will the maintenance occur?`,o:[`A) Saturday evening`,`B) Friday morning`,`C) Sunday afternoon`,`D) Monday night`],a:`A`},
      {q:`What systems will be affected?`,o:[`A) Email and file servers`,`B) Telephone system`,`C) Air conditioning`,`D) Security system`],a:`A`},
      {q:`What should employees do before leaving?`,o:[`A) Save work and log out`,`B) Back up their files`,`C) Submit a report`,`D) Call IT support`],a:`A`}]},
  {title:`Office Relocation Notice`,body:`We are pleased to announce that our office will be relocating to a new building effective July 1st. The new address is 45 Park Avenue, 15th Floor. All phone numbers and email addresses will remain the same. Moving will take place over the weekend of June 28th-29th.`,
   q:[{q:`When will the office relocate?`,o:[`A) July 1st`,`B) June 1st`,`C) August 1st`,`D) September 1st`],a:`A`},
      {q:`What will remain the same?`,o:[`A) Phone numbers and emails`,`B) Office furniture`,`C) Staff members`,`D) Office layout`],a:`A`},
      {q:`What is the new address?`,o:[`A) 45 Park Avenue`,`B) 23 Main Street`,`C) 100 Broadway`,`D) 55 Oak Lane`],a:`A`}]},
  {title:`Holiday Schedule`,body:`Please note that the office will be closed on Monday, July 4th in observance of Independence Day. Regular business hours will resume on Tuesday. If you need assistance during the holiday, please call our emergency hotline at 555-0199.`,
   q:[{q:`Why will the office be closed?`,o:[`A) Independence Day`,`B) Staff training`,`C) Building maintenance`,`D) Company retreat`],a:`A`},
      {q:`When will regular hours resume?`,o:[`A) Tuesday`,`B) Wednesday`,`C) Thursday`,`D) Friday`],a:`A`},
      {q:`What number should be called for emergencies?`,o:[`A) 555-0199`,`B) 555-0123`,`C) 555-0456`,`D) 555-0789`],a:`A`}]},
  {title:`New Vendor Policy`,body:`Effective immediately, all purchases over $500 must be approved by a department manager. A new purchase request form is available on the intranet. Please allow three business days for processing. This policy applies to all departments.`,
   q:[{q:`What is the new policy about?`,o:[`A) Purchase approval requirements`,`B) Travel reimbursement`,`C) Vacation requests`,`D) Remote work policy`],a:`A`},
      {q:`What is the new spending limit requiring approval?`,o:[`A) Over $500`,`B) Over $100`,`C) Over $1000`,`D) Over $50`],a:`A`},
      {q:`How long does processing take?`,o:[`A) Three business days`,`B) One business day`,`C) One week`,`D) Two weeks`],a:`A`}]},
  {title:`Staff Appreciation Lunch`,body:`To thank everyone for their hard work this quarter, management is hosting a staff appreciation lunch this Friday at noon in the cafeteria. Please RSVP to HR by Wednesday if you plan to attend. Vegetarian options will be available.`,
   q:[{q:`Why is the lunch being held?`,o:[`A) To appreciate staff for their hard work`,`B) To celebrate a new product`,`C) To welcome new employees`,`D) To announce a merger`],a:`A`},
      {q:`When is the lunch?`,o:[`A) Friday at noon`,`B) Thursday at noon`,`C) Wednesday at noon`,`D) Friday at 6 PM`],a:`A`},
      {q:`What should attendees do by Wednesday?`,o:[`A) RSVP to HR`,`B) Submit a report`,`C) Prepare a presentation`,`D) Bring a dish`],a:`A`}]},
  {title:`Expense Report Deadlines`,body:`All expense reports for the current quarter must be submitted by the 5th of next month. Late submissions may not be reimbursed until the following quarter. Please attach all original receipts. Digital copies are also accepted.`,
   q:[{q:`When must expense reports be submitted?`,o:[`A) By the 5th of next month`,`B) By the end of this month`,`C) By the 15th of next month`,`D) By next Friday`],a:`A`},
      {q:`What may happen to late submissions?`,o:[`A) Delayed reimbursement`,`B) Automatic rejection`,`C) Additional fee`,`D) Manager approval needed`],a:`A`},
      {q:`What must be attached to the report?`,o:[`A) Original receipts`,`B) Written justification`,`C) Manager signature`,`D) Project summary`],a:`A`}]},
  {title:`Conference Registration`,body:`Registration for the annual industry conference is now open. Early bird pricing is available until August 15th. The conference will be held at the Convention Center from September 20th to 22nd. To register, please visit the conference website.`,
   q:[{q:`What is the announcement about?`,o:[`A) Conference registration`,`B) Office relocation`,`C) New product launch`,`D) Staff changes`],a:`A`},
      {q:`When does early bird pricing end?`,o:[`A) August 15th`,`B) September 20th`,`C) August 1st`,`D) July 15th`],a:`A`},
      {q:`How can employees register?`,o:[`A) Visit the conference website`,`B) Contact HR`,`C) Email the organizer`,`D) Call the hotline`],a:`A`}]},
  {title:`Project Update Meeting`,body:`There will be a project update meeting on Thursday at 2 PM in Conference Room B. All team members are required to attend. Please come prepared with your progress reports. The meeting is expected to last approximately one hour.`,
   q:[{q:`When is the meeting?`,o:[`A) Thursday at 2 PM`,`B) Tuesday at 2 PM`,`C) Friday at 10 AM`,`D) Wednesday at 3 PM`],a:`A`},
      {q:`What should participants bring?`,o:[`A) Progress reports`,`B) Laptops`,`C) Budget documents`,`D) Client feedback`],a:`A`},
      {q:`How long will the meeting be?`,o:[`A) Approximately one hour`,`B) Two hours`,`C) Thirty minutes`,`D) All afternoon`],a:`A`}]},
  {title:`New Security Procedures`,body:`Starting Monday, all employees must use their ID badges to enter the building. Visitors must sign in at the front desk and be escorted at all times. Anyone found without proper identification will be directed to the security office.`,
   q:[{q:`What is the new security requirement?`,o:[`A) Using ID badges to enter`,`B) Submitting a photo`,`C) Fingerprint scanning`,`D) Security questions`],a:`A`},
      {q:`What must visitors do?`,o:[`A) Sign in and be escorted`,`B) Show a passport`,`C) Pay a fee`,`D) Call ahead`],a:`A`},
      {q:`Where will those without ID be directed?`,o:[`A) Security office`,`B) Front desk`,`C) HR department`,`D) Main lobby`],a:`A`}]},
  {title:`Training Workshop`,body:`A training workshop on customer service skills will be held next Tuesday and Wednesday. The workshop is limited to 20 participants. Interested employees should register through the HR portal. Lunch will be provided both days.`,
   q:[{q:`What is the workshop about?`,o:[`A) Customer service skills`,`B) Software training`,`C) Leadership development`,`D) Time management`],a:`A`},
      {q:`How many people can attend?`,o:[`A) Up to 20`,`B) Up to 30`,`C) Up to 15`,`D) Up to 25`],a:`A`},
      {q:`How should employees register?`,o:[`A) Through the HR portal`,`B) By email`,`C) By phone`,`D) In person`],a:`A`}]},
  {title:`Fire Drill Announcement`,body:`A fire drill will be conducted this Thursday at 10 AM. When the alarm sounds, please evacuate the building using the nearest exit. Gather at the designated assembly point in the parking lot. The drill should last approximately 15 minutes.`,
   q:[{q:`When will the fire drill be?`,o:[`A) Thursday at 10 AM`,`B) Wednesday at 10 AM`,`C) Friday at 10 AM`,`D) Thursday at 2 PM`],a:`A`},
      {q:`What should employees do when the alarm sounds?`,o:[`A) Evacuate using the nearest exit`,`B) Wait for instructions`,`C) Go to the cafeteria`,`D) Call security`],a:`A`},
      {q:`Where is the assembly point?`,o:[`A) The parking lot`,`B) The front entrance`,`C) The lobby`,`D) The courtyard`],a:`A`}]},
  {title:`Charity Drive`,body:`The company is organizing a charity drive for the local food bank. Donations of nonperishable food items and cash are welcome. Collection boxes are located in the main lobby. The drive will run from October 1st to October 15th.`,
   q:[{q:`What is the charity drive for?`,o:[`A) A local food bank`,`B) A children's hospital`,`C) An animal shelter`,`D) A disaster relief fund`],a:`A`},
      {q:`What items are being collected?`,o:[`A) Nonperishable food and cash`,`B) Clothing and books`,`C) Toys and games`,`D) Office supplies`],a:`A`},
      {q:`How long will the drive run?`,o:[`A) October 1st to 15th`,`B) October 1st to 31st`,`C) September 15th to October 1st`,`D) October 15th to 30th`],a:`A`}]},
  {title:`Company Newsletter`,body:`The September issue of the company newsletter is now available. This month features an interview with the new marketing director and a review of last quarter's achievements. Copies have been distributed to all departments. The newsletter is also available online.`,
   q:[{q:`What is being announced?`,o:[`A) A new company newsletter`,`B) A new marketing campaign`,`C) Employee promotions`,`D) Annual results`],a:`A`},
      {q:`Who is featured in the newsletter?`,o:[`A) The new marketing director`,`B) The CEO`,`C) The sales manager`,`D) The HR director`],a:`A`},
      {q:`How can employees access the newsletter?`,o:[`A) In print and online`,`B) By email only`,`C) At the library`,`D) Through the mail`],a:`A`}]},
  {title:`Parking Lot Expansion`,body:`Construction will begin next week on the expansion of the employee parking lot. The project is expected to be completed in six weeks. During construction, some parking spaces will be unavailable. Employees are encouraged to use public transportation or carpool.`,
   q:[{q:`What is being constructed?`,o:[`A) An expanded parking lot`,`B) A new building`,`C) A cafeteria`,`D) A conference room`],a:`A`},
      {q:`How long will the project take?`,o:[`A) Six weeks`,`B) Four weeks`,`C) Two months`,`D) Three weeks`],a:`A`},
      {q:`What are employees encouraged to do?`,o:[`A) Use public transit or carpool`,`B) Work from home`,`C) Arrive early`,`D) Park in the visitor lot`],a:`A`}]},
  {title:`New Telephone System`,body:`The company will upgrade its telephone system this weekend. The new system will include voicemail-to-email features and improved call routing. Training sessions on the new system will be offered next week. Please check your email for the schedule.`,
   q:[{q:`What is being upgraded?`,o:[`A) The telephone system`,`B) The computer network`,`C) The security system`,`D) The email server`],a:`A`},
      {q:`What feature will the new system have?`,o:[`A) Voicemail-to-email`,`B) Video conferencing`,`C) Instant messaging`,`D) File sharing`],a:`A`},
      {q:`How can employees learn about the schedule?`,o:[`A) Check their email`,`B) Visit the intranet`,`C) Call IT support`,`D) Attend a meeting`],a:`A`}]},
  {title:`Workplace Safety Reminder`,body:`Please remember to keep all aisles and emergency exits clear at all times. Do not store boxes or equipment in hallways. Report any safety hazards to the facilities department immediately. Regular safety inspections will be conducted monthly.`,
   q:[{q:`What is the main message of this announcement?`,o:[`A) Keep exits and aisles clear`,`B) Complete safety training`,`C) Wear safety equipment`,`D) Report to work on time`],a:`A`},
      {q:`What should employees do if they see a hazard?`,o:[`A) Report it to facilities`,`B) Ignore it`,`C) Fix it themselves`,`D) Call security`],a:`A`},
      {q:`How often will inspections be conducted?`,o:[`A) Monthly`,`B) Weekly`,`C) Quarterly`,`D) Annually`],a:`A`}]},
  {title:`Employee of the Month`,body:`We are proud to announce that Sarah Johnson has been selected as Employee of the Month for September. Sarah has shown outstanding dedication to customer service. She will receive a certificate and a reserved parking space for the month.`,
   q:[{q:`Who is the Employee of the Month?`,o:[`A) Sarah Johnson`,`B) Mark Lee`,`C) David Chen`,`D) Lisa Park`],a:`A`},
      {q:`What is Sarah recognized for?`,o:[`A) Outstanding customer service`,`B) Sales performance`,`C) Team leadership`,`D) Innovation`],a:`A`},
      {q:`What will Sarah receive?`,o:[`A) A certificate and reserved parking`,`B) A cash bonus`,`C) An extra vacation day`,`D) A promotion`],a:`A`}]},
  {title:`Summer Internship Program`,body:`Applications for the summer internship program are now being accepted. The program is open to current university students. Interns will work full-time for 10 weeks starting in June. To apply, please submit your resume and cover letter through the careers portal.`,
   q:[{q:`Who can apply for the internship?`,o:[`A) Current university students`,`B) Recent graduates`,`C) High school students`,`D) Company employees`],a:`A`},
      {q:`How long is the internship?`,o:[`A) 10 weeks`,`B) 8 weeks`,`C) 12 weeks`,`D) 6 weeks`],a:`A`},
      {q:`How should applications be submitted?`,o:[`A) Through the careers portal`,`B) By email`,`C) By mail`,`D) In person`],a:`A`}]},
  {title:`Office Temperature Policy`,body:`To ensure comfort for everyone, the office temperature will be set to 22 degrees Celsius. Personal space heaters are not permitted due to fire safety regulations. If you are too cold, please dress in layers or speak with your manager about adjusting your workspace.`,
   q:[{q:`What temperature will the office be set to?`,o:[`A) 22 degrees Celsius`,`B) 20 degrees Celsius`,`C) 24 degrees Celsius`,`D) 18 degrees Celsius`],a:`A`},
      {q:`Why are space heaters not allowed?`,o:[`A) Fire safety regulations`,`B) Energy conservation`,`C) Noise concerns`,`D) Equipment damage`],a:`A`},
      {q:`What should employees do if they feel cold?`,o:[`A) Dress in layers`,`B) Bring a heater`,`C) Complain to HR`,`D) Work from home`],a:`A`}]},
  {title:`New Health Insurance Options`,body:`During the open enrollment period from November 1st to November 15th, employees can make changes to their health insurance plans. Information sessions will be held in the cafeteria at noon on November 1st and 2nd. Please bring your current insurance card to the sessions.`,
   q:[{q:`When is the open enrollment period?`,o:[`A) November 1st to 15th`,`B) October 1st to 15th`,`C) November 15th to 30th`,`D) December 1st to 15th`],a:`A`},
      {q:`Where will information sessions be held?`,o:[`A) In the cafeteria`,`B) In the conference room`,`C) In the lobby`,`D) In the training room`],a:`A`},
      {q:`What should employees bring to the sessions?`,o:[`A) Their insurance card`,`B) Their ID badge`,`C) A doctor's note`,`D) Their tax forms`],a:`A`}]},
  {title:`Team Building Event`,body:`A team building event has been scheduled for Friday, October 20th. Activities will include a scavenger hunt and group challenges. The event will be held at City Park from 1 PM to 5 PM. Transportation will be provided from the office.`,
   q:[{q:`What is the event scheduled for?`,o:[`A) Team building activities`,`B) Product training`,`C) Client meeting`,`D) Office party`],a:`A`},
      {q:`Where will the event take place?`,o:[`A) City Park`,`B) The office`,`C) A hotel`,`D) A restaurant`],a:`A`},
      {q:`How will employees get there?`,o:[`A) Transportation will be provided`,`B) They must drive themselves`,`C) Public transportation`,`D) Walking`],a:`A`}]},
  {title:`Software License Renewal`,body:`The annual renewal of our office software licenses is due at the end of this month. Department heads should review their software needs and submit a list of required licenses to IT. Failure to renew may result in loss of access to certain programs.`,
   q:[{q:`What is the announcement about?`,o:[`A) Software license renewal`,`B) New software purchase`,`C) IT system upgrade`,`D) Password policy change`],a:`A`},
      {q:`What must department heads do?`,o:[`A) Submit a list of required licenses`,`B) Install new software`,`C) Train their staff`,`D) Update their passwords`],a:`A`},
      {q:`What could happen if licenses are not renewed?`,o:[`A) Loss of access to programs`,`B) Late payment fees`,`C) Security breaches`,`D) System shutdown`],a:`A`}]},
  {title:`Blood Donation Drive`,body:`The Red Cross will be on site for a blood donation drive on Thursday, March 15th. The donation bus will be parked outside the main entrance from 9 AM to 4 PM. Appointments are preferred but walk-ins are welcome. Donors will receive a small gift.`,
   q:[{q:`What event is being announced?`,o:[`A) A blood donation drive`,`B) A health screening`,`C) A vaccination clinic`,`D) A charity run`],a:`A`},
      {q:`Where will the donation bus be located?`,o:[`A) Outside the main entrance`,`B) In the parking garage`,`C) At the side entrance`,`D) In the courtyard`],a:`A`},
      {q:`What will donors receive?`,o:[`A) A small gift`,`B) A cash reward`,`C) Extra vacation time`,`D) A certificate`],a:`A`}]},
  {title:`New Email Signature Policy`,body:`All employees must update their email signatures by next Monday to include the new company logo. The new signature format has been sent to your email. Please ensure that your title and contact information are correct before saving.`,
   q:[{q:`What must employees update?`,o:[`A) Their email signatures`,`B) Their LinkedIn profiles`,`C) Their business cards`,`D) Their voicemail greetings`],a:`A`},
      {q:`By when must the update be done?`,o:[`A) Next Monday`,`B) This Friday`,`C) End of the month`,`D) Tomorrow`],a:`A`},
      {q:`What must be included in the new signature?`,o:[`A) The new company logo`,`B) A photo`,`C) A slogan`,`D) A link to the website`],a:`A`}]},
  {title:`Department Budget Meetings`,body:`Budget meetings for the upcoming fiscal year will be held the week of November 6th. Each department has been assigned a 45-minute time slot. Please prepare a summary of your proposed budget and anticipated expenses. Meeting schedules have been distributed by email.`,
   q:[{q:`What is the purpose of the meetings?`,o:[`A) To discuss department budgets`,`B) To introduce new staff`,`C) To review project status`,`D) To plan the holiday party`],a:`A`},
      {q:`How long is each meeting?`,o:[`A) 45 minutes`,`B) 30 minutes`,`C) 60 minutes`,`D) 90 minutes`],a:`A`},
      {q:`How will employees know their meeting time?`,o:[`A) By email`,`B) By posted notice`,`C) By phone call`,`D) By visiting HR`],a:`A`}]},
  {title:`Elevator Maintenance`,body:`The elevators in the building will be out of service for maintenance on Saturday from 8 AM to 5 PM. Please use the stairwells during this time. If you require assistance accessing the building, please contact the front desk in advance.`,
   q:[{q:`What will be out of service?`,o:[`A) The elevators`,`B) The escalators`,`C) The parking gate`,`D) The front doors`],a:`A`},
      {q:`When will maintenance take place?`,o:[`A) Saturday 8 AM to 5 PM`,`B) Sunday 8 AM to 5 PM`,`C) Saturday 9 AM to 6 PM`,`D) Sunday 9 AM to 6 PM`],a:`A`},
      {q:`What should employees use instead?`,o:[`A) The stairwells`,`B) The service elevator`,`C) The fire escape`,`D) The ramp`],a:`A`}]},
  {title:`Flu Vaccination Program`,body:`The company will offer free flu vaccinations to all employees on Wednesday, October 25th. Vaccinations will be administered by a registered nurse in the medical room on the second floor. Appointments can be booked through the HR portal.`,
   q:[{q:`What is being offered to employees?`,o:[`A) Free flu vaccinations`,`B) Free health checkups`,`C) Free eye exams`,`D) Free dental cleanings`],a:`A`},
      {q:`Where will vaccinations be given?`,o:[`A) In the medical room on the second floor`,`B) In the cafeteria`,`C) In the lobby`,`D) In the conference room`],a:`A`},
      {q:`How can employees book an appointment?`,o:[`A) Through the HR portal`,`B) By calling the nurse`,`C) By visiting reception`,`D) By emailing HR`],a:`A`}]},
  {title:`Warehouse Inventory`,body:`A full inventory count of the warehouse will be conducted on Friday, November 10th. All warehouse staff are required to participate. The warehouse will be closed to regular operations for the day. Please complete any pending shipments by Thursday.`,
   q:[{q:`What will happen on November 10th?`,o:[`A) A full inventory count`,`B) A warehouse renovation`,`C) A staff training`,`D) A safety inspection`],a:`A`},
      {q:`Who must participate?`,o:[`A) All warehouse staff`,`B) All office staff`,`C) Only managers`,`D) Only new employees`],a:`A`},
      {q:`What should be done by Thursday?`,o:[`A) Complete pending shipments`,`B) Clean the warehouse`,`C) Submit inventory reports`,`D) Order new supplies`],a:`A`}]},
  {title:`Customer Satisfaction Survey Results`,body:`The results of the latest customer satisfaction survey are now available. Our overall satisfaction rating has improved to 4.5 out of 5 stars. The areas needing improvement have been identified, and action plans are being developed. Thank you for your continued dedication.`,
   q:[{q:`What is being announced?`,o:[`A) Customer satisfaction survey results`,`B) New product launch`,`C) Employee performance review`,`D) Financial results`],a:`A`},
      {q:`What is the overall satisfaction rating?`,o:[`A) 4.5 out of 5 stars`,`B) 4 out of 5 stars`,`C) 3.5 out of 5 stars`,`D) 5 out of 5 stars`],a:`A`},
      {q:`What is being developed?`,o:[`A) Action plans for improvement`,`B) New training programs`,`C) Updated policies`,`D) Marketing strategies`],a:`A`}]},
  {title:`New Catering Service`,body:`We are excited to announce that the office cafeteria will now be operated by FreshBites Catering starting next month. The new menu will feature healthier options and daily specials. All employees are welcome to attend a tasting event on Friday at noon.`,
   q:[{q:`What is changing in the cafeteria?`,o:[`A) The catering service provider`,`B) The menu prices`,`C) The operating hours`,`D) The seating arrangement`],a:`A`},
      {q:`What will the new menu feature?`,o:[`A) Healthier options and daily specials`,`B) International cuisine`,`C) Breakfast items only`,`D) Takeout options`],a:`A`},
      {q:`When is the tasting event?`,o:[`A) Friday at noon`,`B) Monday at noon`,`C) Wednesday at noon`,`D) Thursday at 6 PM`],a:`A`}]},
  {title:`Department Restructuring`,body:`The company will be restructuring the sales and marketing departments effective January 1st. The new structure will create a unified customer relations division. All affected employees will receive detailed information in a meeting next week.`,
   q:[{q:`What is being restructured?`,o:[`A) Sales and marketing departments`,`B) Finance and accounting`,`C) IT and operations`,`D) HR and administration`],a:`A`},
      {q:`What will be created?`,o:[`A) A unified customer relations division`,`B) A new product team`,`C) A regional office`,`D) A training center`],a:`A`},
      {q:`How will affected employees be informed?`,o:[`A) In a meeting next week`,`B) By email today`,`C) By letter`,`D) Through managers`],a:`A`}]},
  {title:`Holiday Party Invitation`,body:`You are invited to the annual company holiday party on Friday, December 15th at the Grand Ballroom, 7 PM to 11 PM. The evening will include dinner, dancing, and entertainment. Please RSVP by December 1st. Spouses and guests are welcome.`,
   q:[{q:`What event is being announced?`,o:[`A) The company holiday party`,`B) The New Year celebration`,`C) The company retreat`,`D) The award ceremony`],a:`A`},
      {q:`Where will the party be held?`,o:[`A) The Grand Ballroom`,`B) The office cafeteria`,`C) A restaurant downtown`,`D) A local hotel`],a:`A`},
      {q:`Who can attend?`,o:[`A) Employees and their guests`,`B) Employees only`,`C) Managers only`,`D) All staff and clients`],a:`A`}]},
  {title:`Professional Development Fund`,body:`The company is establishing a professional development fund to support employees pursuing certifications or advanced degrees. Employees can apply for up to $2,000 per year. Applications will be reviewed by a committee. The first deadline is March 31st.`,
   q:[{q:`What is the purpose of the fund?`,o:[`A) To support professional development`,`B) To fund team outings`,`C) To upgrade office equipment`,`D) To sponsor charity events`],a:`A`},
      {q:`What is the maximum amount per year?`,o:[`A) $2,000`,`B) $1,000`,`C) $3,000`,`D) $500`],a:`A`},
      {q:`When is the first deadline?`,o:[`A) March 31st`,`B) April 15th`,`C) January 31st`,`D) June 30th`],a:`A`}]},
  {title:`New Recycling Program`,body:`We are expanding our recycling program to include electronic waste. A collection bin for old electronics will be placed in the lobby. Please do not dispose of batteries, computers, or phones in regular trash. Contact facilities for large item pickup.`,
   q:[{q:`What is being added to the recycling program?`,o:[`A) Electronic waste`,`B) Plastic bottles`,`C) Paper products`,`D) Glass containers`],a:`A`},
      {q:`Where is the collection bin located?`,o:[`A) In the lobby`,`B) In the parking lot`,`C) In the cafeteria`,`D) In the warehouse`],a:`A`},
      {q:`How should large items be handled?`,o:[`A) Contact facilities for pickup`,`B) Leave them by the bin`,`C) Take them to a center`,`D) Put them in regular trash`],a:`A`}]},
  {title:`Emergency Contact Update`,body:`Please update your emergency contact information in the HR system by the end of this month. Accurate emergency contacts are essential for employee safety. You can update your information through the employee self-service portal.`,
   q:[{q:`What must employees update?`,o:[`A) Emergency contact information`,`B) Personal email address`,`C) Bank details`,`D) Home address`],a:`A`},
      {q:`Why is this important?`,o:[`A) For employee safety`,`B) For payroll processing`,`C) For tax purposes`,`D) For benefits enrollment`],a:`A`},
      {q:`How can employees update their information?`,o:[`A) Through the employee self-service portal`,`B) By visiting HR in person`,`C) By filling out a paper form`,`D) By calling the HR department`],a:`A`}]},
  {title:`New Shift Schedule`,body:`The production department will adopt a new shift schedule starting next month. The day shift will run from 6 AM to 2 PM, and the night shift from 10 PM to 6 AM. A rotating schedule will be posted on the bulletin board.`,
    q:[{q:`What is changing?`,o:[`A) The shift schedule`,`B) The pay rate`,`C) The break times`,`D) The dress code`],a:`A`},
       {q:`What are the new shift hours?`,o:[`A) 6 AM to 2 PM and 10 PM to 6 AM`,`B) 7 AM to 3 PM and 3 PM to 11 PM`,`C) 8 AM to 4 PM and 4 PM to 12 AM`,`D) 9 AM to 5 PM and 5 PM to 1 AM`],a:`A`},
       {q:`Where will the schedule be posted?`,o:[`A) On the bulletin board`,`B) On the intranet`,`C) By email`,`D) In the newsletter`],a:`A`}]},
  {title:`New Vendor Onboarding Process`,body:`A new vendor onboarding process will be implemented starting next quarter. All vendors must complete an online registration form and provide proof of insurance. Accounts payable will host a training session for department staff who work with vendors.`,
    q:[{q:`What is being implemented?`,o:[`A) A new vendor onboarding process`,`B) A purchasing system`,`C) A inventory management tool`,`D) A quality control program`],a:`A`},
       {q:`What must vendors provide?`,o:[`A) Proof of insurance`,`B) Business license`,`C) Tax documents`,`D) Product samples`],a:`A`},
       {q:`Who should attend the training session?`,o:[`A) Staff who work with vendors`,`B) All new employees`,`C) Warehouse workers`,`D) Sales team members`],a:`A`}]},
];

for (const p of p7Extra) {
  const bt = String.fromCharCode(96);
  for (const q of p.q) {
    out.push(`  {id:${id++},part:7,question:${bt}${q.q}${bt},options:[${q.o.map(o=>`${bt}${o}${bt}`).join(',')}],answer:${bt}${q.a}${bt},passage:${bt}${p.body}${bt},passageTitle:${bt}${p.title}${bt},passageBody:${bt}${p.body}${bt}},`);
  }
}

// Write output
fs.writeFileSync('output-fixed.txt', out.join('\n'));
console.log('Generated', out.length, 'lines, final ID:', id-1);
