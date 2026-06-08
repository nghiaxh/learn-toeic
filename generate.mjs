import fs from 'fs';

let id = 601;
const lines = [];
const BT = String.fromCharCode(96); // backtick
function q(s) { return BT + s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + BT; }
function opt(label, text) { return BT + label + ') ' + text.replace(/[\\\n\r]/g, '') + BT; }

function makeQ(obj) {
  let line = '  {id:' + obj.id + ',part:' + obj.part + ',question:' + q(obj.question) + ',options:[';
  line += obj.options.map(function(o, i) { return opt(String.fromCharCode(65 + i), o); }).join(',');
  line += '],answer:' + q(obj.answer);
  if (obj.passage) line += ',passage:' + q(obj.passage);
  if (obj.passageTitle) line += ',passageTitle:' + q(obj.passageTitle);
  if (obj.passageBody) line += ',passageBody:' + q(obj.passageBody);
  if (obj.blanks) {
    line += ',blanks:[';
    line += obj.blanks.map(function(b) {
      return '{options:[' + b.options.map(function(o, i) { return opt(String.fromCharCode(65 + i), o); }).join(',') + '],answer:' + q(b.answer) + '}';
    }).join(',');
    line += ']';
  }
  line += '}';
  return line;
}

function P1() {
  const scenes = [
    ['A technician', 'installing', 'a server rack in a data center'],
    ['A librarian', 'organizing', 'books on a cart near shelves'],
    ['A group of tourists', 'boarding', 'a sightseeing bus downtown'],
    ['A fisherman', 'repairing', 'a fishing net on a dock'],
    ['A jeweler', 'examining', 'a diamond under a magnifying glass'],
    ['A flight attendant', 'demonstrating', 'safety equipment to passengers'],
    ['A farmer', 'harvesting', 'vegetables in a sunny field'],
    ['A painter', 'painting', 'a wooden fence outside a house'],
    ['A cashier', 'scanning', 'items at a grocery checkout counter'],
    ['A tailor', 'measuring', 'fabric on a large work table'],
    ['A receptionist', 'answering', 'a phone at a hotel front desk'],
    ['A mechanic', 'checking', 'the engine of a red car'],
    ['A street vendor', 'selling', 'flowers at a market stall'],
    ['A security guard', 'patrolling', 'a building entrance area'],
    ['A photographer', 'taking', 'a picture of a model in a studio'],
    ['A cleaner', 'mopping', 'the floor of a long hallway'],
    ['A barber', 'cutting', 'a customer hair in a barbershop'],
    ['A scientist', 'looking', 'through a microscope in a lab'],
    ['A delivery driver', 'carrying', 'a package toward a house door'],
    ['A gardener', 'watering', 'plants using a hose in a greenhouse'],
    ['A chef', 'decorating', 'a chocolate cake in a kitchen'],
    ['A musician', 'playing', 'a violin on a stage under lights'],
    ['A cyclist', 'riding', 'a bicycle along a path in a park'],
    ['A waitress', 'serving', 'food on a tray to customers at a table'],
  ];
  for (const [s, v, sc] of scenes) {
    const opts = [
      s + ' is ' + v + ' ' + sc,
      'A customer is waiting at the checkout counter',
      'People are walking through the area',
      'The space is empty at the moment',
    ];
    lines.push(makeQ({
      id: id++, part: 1,
      question: 'What is happening in the photograph?',
      options: opts,
      answer: 'A',
      passage: s + ' is ' + v + ' ' + sc + ' in a well-lit environment.',
    }));
  }
  console.log('P1 done, id=' + (id - 1));
}

function P2() {
  const data = [
    ['When does the conference begin?', 'Next Monday at 9 AM', 'Yes, it begins soon', 'In the convention center'],
    ['Did you receive the package?', 'Yes, it arrived this morning', 'The package is heavy', 'By courier service'],
    ['Who is responsible for this account?', 'Mr. Kim is handling it', 'The account is active', 'In the sales department'],
    ['How many reports do we need?', 'Ten copies for the board', 'The reports are ready', 'I will print them now'],
    ['Why was the shipment stopped?', 'There was a customs issue', 'The shipment is large', 'At the shipping dock'],
    ['Where is the staff meeting?', 'In Conference Room B', 'The meeting is at 3', 'All staff must attend'],
    ['What kind of software do you use?', 'We use CloudSuite Pro', 'The software is new', 'IT installed it last week'],
    ['How often are safety inspections?', 'Every six months', 'The inspection passed', 'By the safety officer'],
    ['Is the printer working now?', 'Yes, it was just fixed', 'The printer is new', 'In the copy room'],
    ['When should I submit the documents?', 'By Friday at 5 PM', 'The documents are ready', 'To the HR department'],
    ['Where did you park the car?', 'In the underground garage', 'I drove to work today', 'The car is blue'],
    ['What did the CEO announce?', 'A new partnership deal', 'The CEO was speaking', 'At the annual meeting'],
    ['How much does the membership cost?', '$99 per year', 'The membership is worth it', 'You can pay online'],
    ['Can you show me how this works?', 'Sure, let me demonstrate', 'Yes, it works well', 'The instructions are clear'],
    ['Whose laptop is this?', 'It belongs to Ms. Park', 'The laptop is new', 'On the desk'],
    ['When is the deadline?', 'The end of this month', 'Yes, it is due soon', 'The deadline was extended'],
    ['Why do not we take a break?', 'That sounds like a good idea', 'Because we are busy', 'The break room is empty'],
    ['How was your flight?', 'It was smooth and on time', 'I flew business class', 'To Chicago'],
    ['What time does the store open?', 'At 10 AM on weekdays', 'Yes, it is open now', 'On Main Street'],
    ['Did you call the client back?', 'Yes, I left a message', 'The client is waiting', 'By telephone'],
    ['Who joined the marketing team?', 'Two new coordinators', 'The team is expanding', 'Last month'],
    ['Where can I find the restroom?', 'Down the hall to your left', 'It is on the second floor', 'The restroom is clean'],
    ['How long is the warranty?', 'It covers two full years', 'The product is guaranteed', 'You can extend it'],
    ['What should I bring to the workshop?', 'A laptop and a notebook', 'The workshop is useful', 'In the training room'],
    ['Are you attending the seminar?', 'Yes, I registered yesterday', 'The seminar is full', 'At the convention center'],
    ['When was the contract signed?', 'Earlier this week', 'The contract is final', 'By the legal team'],
    ['How do I access the server?', 'Use your employee login', 'The server is down', 'IT can help you'],
    ['What is the policy on remote work?', 'Up to two days per week', 'The policy changed recently', 'Ask your manager'],
    ['Who approved the budget?', 'The finance director did', 'The budget was approved', 'Last quarter'],
    ['Which color do you want?', 'The blue one looks better', 'Both colors are nice', 'You can choose either'],
    ['Why was the event postponed?', 'Due to a scheduling conflict', 'The event was popular', 'It will be rescheduled'],
    ['How many people attended?', 'About 150 participants', 'The attendance was great', 'In the main hall'],
    ['Where is the nearest subway station?', 'Two blocks from here', 'The subway is convenient', 'You need a transit card'],
    ['What kind of coffee do you serve?', 'We have Arabica and Robusta', 'The coffee is freshly brewed', 'In the cafe'],
    ['Did you enjoy the movie?', 'Yes, it was very entertaining', 'The movie was long', 'At the downtown cinema'],
    ['When can I meet with the manager?', 'She is available at 2 PM', 'The manager is busy now', 'In her office'],
    ['How do you like your new car?', 'It is very fuel efficient', 'I bought it last week', 'The car is red'],
    ['Who is giving the presentation?', 'Ms. Chen from Marketing', 'The presentation is ready', 'In the auditorium'],
    ['What is the weather like today?', 'It is sunny and warm', 'The forecast was wrong', 'I will check online'],
    ['Should I bring my own materials?', 'No, everything is provided', 'Yes, bring your own', 'The materials are free'],
    ['How much is the late fee?', 'It is $10 per day', 'The payment is overdue', 'You can pay online'],
    ['Where did you learn English?', 'At a language institute', 'I practice every day', 'English is useful'],
    ['Why is the computer running slow?', 'It needs more memory', 'The computer is old', 'IT will check it'],
    ['When is the next holiday?', 'Next Monday is a holiday', 'The office will be closed', 'I am planning a trip'],
    ['Can I get a discount?', 'We offer a 10% discount', 'The price is fixed', 'Check our promotions page'],
    ['What does this button do?', 'It starts the machine', 'The button is red', 'Press it once'],
    ['How far is the airport?', 'About 30 kilometers away', 'You can take a taxi', 'The airport is busy'],
    ['Who manages the IT department?', 'Mr. Johnson is the director', 'The IT team is helpful', 'On the third floor'],
    ['What time is lunch served?', 'From 12 to 1:30 PM', 'The cafeteria is open', 'Lunch is included'],
    ['Did you finish the assignment?', 'Yes, I submitted it today', 'The assignment was easy', 'I worked on it all night'],
    ['How was the hotel?', 'It was comfortable and clean', 'I booked it online', 'The hotel is downtown'],
    ['Which train goes to Seoul?', 'The KTX express train', 'The station is nearby', 'Trains run every hour'],
    ['Why is the office closed?', 'It is a national holiday', 'The office will reopen tomorrow', 'All employees are off'],
    ['How do I reset my password?', 'Click on forgot password', 'The password is case sensitive', 'IT can help reset it'],
    ['What is the exchange rate?', 'It is 1,300 won per dollar', 'The rate changes daily', 'At the bank'],
    ['Can you recommend a restaurant?', 'The Italian place on 5th is great', 'I like Korean food', 'The restaurant is busy'],
    ['When will the results be announced?', 'By the end of next week', 'The results are promising', 'Check the website'],
    ['How many bedrooms does it have?', 'It has two bedrooms', 'The apartment is spacious', 'On the 10th floor'],
    ['Who should I contact for support?', 'Our customer service team', 'Support is available 24/7', 'By email or phone'],
    ['What is the purpose of this form?', 'It is for visa application', 'The form must be signed', 'Submit it online'],
    ['Did you check the inventory?', 'Yes, everything is in stock', 'The inventory is accurate', 'I will update it now'],
    ['How often do you exercise?', 'Three times a week', 'The gym is on the 2nd floor', 'I prefer yoga'],
    ['Where is the lost and found?', 'At the front desk', 'You can check with security', 'Lost items are logged'],
    ['What are your hours of operation?', 'From 9 AM to 6 PM daily', 'We are closed on Sundays', 'The hours are posted'],
    ['Why is there a delay?', 'Due to technical difficulties', 'The delay is 30 minutes', 'We apologize for it'],
    ['How do I apply for the position?', 'Submit your resume online', 'The position is still open', 'HR will review it'],
    ['Who won the award?', 'The sales team won it', 'The award ceremony is tonight', 'They worked very hard'],
    ['What is included in the package?', 'A charger and earphones', 'The package is sealed', 'Check the contents'],
    ['When does the sale end?', 'This Sunday at midnight', 'The sale is very popular', 'Online and in stores'],
    ['Can I pay with a credit card?', 'Yes, we accept all major cards', 'Cash is also accepted', 'The payment is secure'],
    ['How was the customer feedback?', 'It was very positive overall', 'The feedback was useful', 'We will improve'],
    ['Where is the emergency exit?', 'At the end of the hallway', 'The exit is clearly marked', 'Follow the green signs'],
    ['What size do you need?', 'I need a medium size', 'The sizes run small', 'We have your size'],
    ['Why did you choose this school?', 'It has a great reputation', 'The school is affordable', 'I got a scholarship'],
    ['How much is the deposit?', 'It is one month rent', 'The deposit is refundable', 'Pay by bank transfer'],
    ['Who is your insurance provider?', 'We use Global Health Insure', 'The insurance is comprehensive', 'HR can help you'],
    ['What is the Wi-Fi password?', 'It is guest2024', 'The Wi-Fi is free', 'Ask the front desk'],
    ['When is the best time to call?', 'Between 10 AM and 2 PM', 'You can call anytime', 'We are always available'],
    ['Did you book the venue?', 'Yes, it is confirmed for Saturday', 'The venue is beautiful', 'It costs $500'],
    ['How long does shipping take?', 'About 5 to 7 business days', 'Shipping is free over $50', 'Tracking is provided'],
    ['What color is the new model?', 'It comes in black and white', 'The model is very popular', 'Check the website'],
    ['Where should I sign?', 'Please sign at the bottom', 'The document is ready', 'Use a blue pen'],
    ['Why do not we meet for coffee?', 'I would love to', 'Because I am busy', 'At the cafe on Main'],
    ['How do you take your coffee?', 'With milk and no sugar', 'I drink tea instead', 'The coffee is strong'],
    ['Is there a dress code?', 'Business casual is required', 'No dress code on Fridays', 'Check the employee handbook'],
    ['When is the next bus?', 'It arrives in 10 minutes', 'The bus is usually on time', 'At the bus stop'],
    ['Who will be your reference?', 'My previous supervisor', 'References are required', 'List two references'],
    ['What is the cancellation policy?', 'Full refund up to 24 hours', 'Cancellations must be in writing', 'A fee may apply'],
    ['How did you get here?', 'I took the train', 'The traffic was light', 'I used GPS navigation'],
    ['Why should we hire you?', 'I have relevant experience', 'I am a quick learner', 'I work well in teams'],
    ['Can I get a receipt?', 'I will email it to you', 'The receipt is in the bag', 'Print it from your account'],
    ['How much is the registration?', 'The early bird rate is $200', 'Registration is now open', 'Register online'],
    ['What is your return policy?', 'Returns accepted within 30 days', 'Items must be unused', 'Free return shipping'],
    ['Where did you buy that?', 'At the department store', 'It was on sale', 'I ordered it online'],
    ['When was the company founded?', 'In 1995', 'The company is well established', 'By the current CEO father'],
    ['Who designed the website?', 'An external agency', 'The website was redesigned', 'It looks modern'],
    ['How often do you travel?', 'About once a month', 'I travel for business', 'I prefer video calls'],
    ['What is your favorite part?', 'Working with the team', 'The job is rewarding', 'I enjoy solving problems'],
    ['Did you see the announcement?', 'Yes, I read it this morning', 'The announcement was important', 'It was sent by email'],
    ['Will you join us for dinner?', 'I would love to, thank you', 'I already have plans', 'The dinner is at 7'],
  ];
  for (const [q, a, b, c] of data) {
    lines.push(makeQ({ id: id++, part: 2, question: q, options: [a, b, c], answer: 'A' }));
  }
  console.log('P2 done, id=' + (id - 1));
}

function P3() {
  const convos = [];
  // Generate 52 conversations with 3 questions each = 156 questions
  const topics = [
    ['a new parking policy', 'registering vehicles', 'the woman will register her car', 'M: Did you see the memo about parking? W: Yes, starting next month we must register. M: I will do it today. W: Good idea.'],
    ['the quarterly sales report', 'finalizing numbers', 'the man will add the data', 'W: Is the sales report ready? M: Almost, I just need the final numbers. W: When can I expect it? M: By end of day.'],
    ['a supplier delivery delay', 'Tuesday instead of Monday', 'the woman will update the client', 'M: The supplier called about the delivery. W: When will it arrive? M: Tuesday instead of Monday. W: I will inform the client.'],
    ['a team building event', 'this Friday afternoon', 'the woman will decide by tomorrow', 'W: Are you going to the team building event? M: I am not sure yet. W: Let me know by tomorrow. M: Okay, I will.'],
    ['slow internet connection', 'IT is working on it', 'the woman needs it for a video call', 'M: The internet has been slow all morning. W: IT said they are working on it. M: I hope it is fixed soon. W: Me too.'],
    ['signing up for a language course', 'Japanese', 'it will help with business partners', 'W: I am thinking of taking a language course. M: Which language? W: Japanese. M: That will be useful for work.'],
    ['replacing lobby flowers', 'calling the florist', 'getting a price for weekly arrangements', 'M: The lobby flowers look wilted. W: I will call the florist. M: Ask about weekly pricing too. W: Will do.'],
    ['changing health insurance', 'the new plan starts in July', 'premiums will decrease by 5 percent', 'W: I heard we are changing insurance providers. M: Yes, the new plan starts in July. W: Are premiums changing? M: They are going down.'],
    ['ordering new business cards', 'PrintPro', 'send the design when ready', 'M: I need to order new business cards. W: Use PrintPro as usual. M: Yes, I will send the design. W: Great.'],
    ['a conference in Singapore', 'attending workshops', 'exchanged cards with three companies', 'W: How was the Singapore conference? M: Excellent. I attended several workshops. W: Did you meet prospects? M: Yes, three companies.'],
    ['an empty water cooler', 'calling the supplier', 'getting a second cooler for floor 2', 'M: The water cooler is empty again. W: I will call the supplier. M: Can we get one for floor 2? W: I will ask management.'],
    ['rescheduling a client meeting', 'Thursday', 'she has a meeting with the CEO', 'W: The client wants to move the meeting to Thursday. M: Can you make it? W: I have another meeting that day. M: With who? W: The CEO.'],
    ['a presentation preparation', 'tomorrow', 'adding the sales data', 'M: Are you ready for the presentation tomorrow? W: Almost, I need to add sales data. M: Need any help? W: No, I am fine.'],
    ['new office layout plans', 'open plan design is good', 'he prefers his own office', 'W: Did you see the new office plans? M: Yes, I like the open plan. W: I prefer having my own office though. M: You will get used to it.'],
    ['cannot log into email', 'resetting password', 'contact the IT help desk', 'M: I cannot log into my email. W: Did you try resetting your password? M: Yes, but it did not work. W: Contact IT then.'],
    ['a rescheduled budget meeting', 'the 15th', 'she will update her calendar', 'W: The budget meeting has been rescheduled. M: To when? W: The 15th instead of the 10th. M: I will update my calendar.'],
    ['a new restaurant downstairs', 'lunch specials are reasonable', 'go there today', 'M: Have you tried the new restaurant downstairs? W: Yes, the lunch specials are good. M: Let us go there today. W: Sure.'],
    ['taking a day off', 'next Friday', 'submit the request through the system', 'W: I need to take next Friday off. M: Do you have vacation days? W: Yes, plenty. M: Submit it through the system.'],
    ['a shipment of paper arrived', 'they were running low', 'store it in the supply closet', 'M: The paper shipment arrived. W: Great, we were running low. M: Where should I put it? W: In the supply closet.'],
    ['hiring new developers', 'five positions open', 'tell them to apply online', 'W: I heard we are hiring new developers. M: Yes, five positions. W: I know some qualified people. M: Tell them to apply online.'],
    ['broken air conditioning', 'submitted a maintenance request', 'this afternoon', 'M: The AC is not working properly. W: I already submitted a request. M: When will they come? W: This afternoon.'],
    ['going to the bank', 'during lunch break', 'deposit a check', 'W: I am going to the bank at lunch. M: Can you deposit this check for me? W: Sure, I can do that.'],
    ['meeting room too small', 'booking the conference hall', 'right now', 'M: The meeting room is too small for 20 people. W: Should I book the conference hall? M: Yes, please. W: I will do it now.'],
    ['a market analysis report', 'she is working on it', 'by 5 PM', 'W: Did you finish the market analysis? M: I am working on it now. W: The client is asking. M: I will send it by 5 PM.'],
    ['updating the employee handbook', 'remote work policy section', 'the legal department will review', 'M: We need to update the employee handbook. W: Which section? M: The remote work policy. W: Legal will need to review it.'],
    ['new software training', 'next week', 'ensure her team attends', 'W: The software training is next week. M: Is it mandatory? W: Yes, all employees must attend. M: I will make sure my team is there.'],
    ['broken elevator', 'since yesterday', 'this afternoon', 'M: The elevator has been out since yesterday. W: I know, I used the stairs. M: When will it be fixed? W: The repair team comes this afternoon.'],
    ['buying a new laptop', 'current one is too slow', 'check with IT first', 'W: I am thinking of buying a new laptop. M: What is wrong with yours? W: It is too slow. M: Check with IT first.'],
    ['jammed printer', 'three times this week', 'getting a new printer', 'M: The printer in the corner is jammed again. W: That is the third time this week. M: We should get a new one. W: I agree.'],
    ['missing the bus', 'taking the earlier bus', 'carpooling', 'W: I missed the bus this morning. M: Take the earlier bus tomorrow. W: Good idea. M: Or you could carpool with someone.'],
    ['extended project deadline', 'two extra weeks', 'relieved', 'M: The deadline has been extended. W: How much time? M: Two more weeks. W: That is a relief.'],
    ['organizing the holiday party', 'decorations', 'she volunteers to help', 'W: I am organizing the office holiday party. M: Need any help? W: You could help with decorations. M: I would love to.'],
    ['a promotion', 'team leader', 'next Monday', 'M: I got promoted. W: Congratulations! What is your new role? M: Team leader. W: When do you start? M: Next Monday.'],
    ['broken vending machine', 'it took his money', 'call the service company', 'W: The vending machine is broken. M: It also took my money. W: I will call the service company. M: Please mention that.'],
    ['ordering lunch for a meeting', 'yes, it is convenient', 'sandwiches and salads', 'M: Should we order lunch for the meeting? W: Yes, that would be convenient. M: Any preferences? W: Sandwiches and salads.'],
    ['a dentist appointment', '3 PM tomorrow', 'let the manager know', 'W: I have a dentist appointment at 3 PM tomorrow. M: Do you need to leave early? W: Yes, at 2:30. M: Just let the manager know.'],
    ['a board presentation', 'approved with minor changes', 'happy', 'M: The board presentation went well. W: Did they approve the proposal? M: Yes, with minor changes. W: That is great news.'],
    ['a new food truck', 'Korean barbecue', 'go for lunch', 'W: There is a new food truck outside. M: What do they sell? W: Korean barbecue. M: Want to go for lunch? W: Sure.'],
    ['subsidized gym membership', 'half the cost', 'considering it', 'M: Did you hear about the gym membership benefit? W: Yes, the company pays half. M: Are you signing up? W: I am considering it.'],
    ['a fire alarm test', '10 AM', 'inform her team', 'W: The fire alarm test is on Thursday. M: What time? W: 10 AM. M: I will let my team know.'],
    ['updating a profile', 'the communications team', 'send her the email', 'M: I need to update my profile on the website. W: Contact the communications team. M: Do you have their email? W: I will send it to you.'],
    ['using video conferencing', 'saving on travel costs', 'research platforms', 'W: We should use more video conferencing. M: That would save on travel. W: Exactly. M: I will look into platforms.'],
    ['a disorganized supply closet', 'organizing it', 'Friday afternoon', 'M: The supply closet is a mess. W: Should we organize it? M: Good idea. W: How about Friday afternoon?'],
    ['online compliance training', 'about two hours', 'tonight', 'W: I completed the compliance training. M: How long did it take? W: About two hours. M: I will start mine tonight.'],
    ['the CEO visiting the branch', 'next Tuesday', 'the financial data', 'M: The CEO is visiting our branch next Tuesday. W: We should prepare a presentation. M: I will prepare the financial data.'],
    ['a transit pass discount', '20 percent', 'yes, definitely', 'W: The company is offering a discount on transit passes. M: How much? W: 20 percent. M: I will sign up for sure.'],
    ['a missing file', 'to her work email', 'Quarterly Data', 'M: I cannot find the file you sent. W: I sent it to your work email. M: What was the subject? W: Quarterly Data.'],
    ['a client meeting this week', 'schedule is full', 'Thursday at 2 PM', 'W: The client wants a meeting this week. M: My schedule is full. W: How about Thursday at 2 PM? M: That works.'],
    ['dried office plants', 'the cleaning staff', 'water them today', 'M: The office plants look dried out. W: The cleaning staff usually waters them. M: I think they forgot. W: I will water them today.'],
    ['needing receipts by Friday', 'Friday', 'collect them this afternoon', 'W: Accounting needs receipts by Friday. M: I have not gathered them all. W: You should hurry. M: I will collect them this afternoon.'],
    ['repainting the reception area', 'light blue', 'get paint samples', 'M: We should repaint the reception area. W: What color? M: Light blue. W: That would look professional. M: I will get samples.'],
    ['taking a certification course', 'good for his career', 'in the evenings', 'W: I am thinking of taking a certification. M: That would be good for your career. W: It is in the evenings. M: You can manage it.'],
  ];
  for (const [topic, detail1, detail2, dialog] of topics) {
    lines.push(makeQ({ id: id++, part: 3, question: 'What is the conversation about?', options: [topic, 'A company event', 'A personal matter', 'A weather discussion'], answer: 'A', passage: dialog }));
    lines.push(makeQ({ id: id++, part: 3, question: 'What does the woman say about ' + detail1 + '?', options: [detail2, 'She disagrees', 'She is not sure', 'She ignores it'], answer: 'A', passage: dialog }));
    lines.push(makeQ({ id: id++, part: 3, question: 'What will happen next?', options: ['The man will take action', 'They will wait', 'They will ask for help', 'Nothing will change'], answer: 'A', passage: dialog }));
  }
  console.log('P3 done, id=' + (id - 1));
}

function P4() {
  const talks = [
    ['a company merger announcement', 'next Tuesday at 10 AM', 'expanded market reach', 'Good morning. I am pleased to announce that our company has finalized a merger with TechWorld Inc. This partnership will expand our market reach. There will be a town hall meeting next Tuesday at 10 AM to discuss details.'],
    ['a weekend sale event', 'up to 50 percent off', 'electronics are excluded', 'Attention shoppers. Our weekend sale is now in progress. Enjoy up to 50 percent off selected items. Electronics and furniture are excluded. The sale ends Sunday at closing time.'],
    ['an airport announcement', 'Flight 205 to Tokyo', '3:30 PM', 'All passengers on Flight 205 to Tokyo please proceed to Gate 7 for final boarding. The flight will depart at 3:30 PM. Have your boarding pass and passport ready.'],
    ['a new store opening', '450 Park Avenue', 'a gift bag worth $50', 'We are excited to announce the opening of our new flagship store at 450 Park Avenue. The grand opening will be on Saturday September 9th. The first 100 customers will receive a gift bag valued at $50.'],
    ['employee survey results', 'team collaboration', 'a committee will be formed', 'The results of the employee engagement survey are in. Overall satisfaction has improved by 12 percent. The top-rated area was team collaboration. We will be forming a committee to address concerns.'],
    ['a cybersecurity training reminder', '45 minutes', 'those who completed it last year', 'This is a reminder that all employees must complete cybersecurity awareness training by end of quarter. The training takes 45 minutes and is on the learning portal. Those who completed it last year need not retake it.'],
    ['the annual company picnic', 'Riverside Park', 'July 10th', 'The annual company picnic will be held on Saturday July 22nd at Riverside Park from 11 AM to 4 PM. There will be barbecue lunch, games, and prizes. Please RSVP by July 10th.'],
    ['being named a top employer', 'Business Today magazine', 'all employees', 'Great news. Our company has been named one of the top employers in the country by Business Today magazine. Thank you all for your contribution to making this a great place to work.'],
    ['a cafeteria closure for renovation', 'on Monday', 'vending machine food and drinks', 'The cafeteria will be closed this Saturday for kitchen renovations. Regular service will resume on Monday. Limited pre-packaged meals and beverages will be available from vending machines.'],
    ['a lockdown drill', 'Thursday June 15th at 10 AM', '20 minutes', 'This is a security announcement. The building will conduct a lockdown drill on Thursday June 15th at 10 AM. Remain in your office and lock your doors. The drill will last approximately 20 minutes.'],
    ['a new summer menu', 'grilled salmon salad', '4 PM to 6 PM daily', 'We are pleased to introduce our new summer menu at Cafe Bistro. New items include grilled salmon salad and fresh berry smoothies. Happy hour is from 4 PM to 6 PM daily.'],
    ['a shareholders meeting', '15 percent', 'expand into three Asian markets', 'Welcome to the annual shareholders meeting. Revenue increased by 15 percent this year. Net profit reached $50 million. We plan to expand into three new markets in Asia.'],
    ['a library holiday closure', 'extended to Wednesday', 'the book drop', 'The library will be closed on Monday May 29th for Memorial Day. Items due on Monday have been extended to Wednesday. The book drop will remain accessible for returns.'],
    ['a room being ready', '1208', '7 AM to 10 AM', 'Thank you for choosing Grand Hotel. Your room 1208 is now ready. Luggage will be delivered within 15 minutes. Complimentary breakfast is served from 7 AM to 10 AM.'],
    ['a monthly safety inspection', 'clean work areas', 'one week', 'The monthly safety inspection will take place on Wednesday June 7th. All departments must ensure work areas are clean and free of hazards. Issues found must be resolved within one week.'],
    ['a promotion for new customers', 'first month free', 'end of the month', 'We are offering a special promotion for new customers. Sign up for an annual membership and receive your first month free. This offer is valid until the end of the month.'],
    ['a traffic update', 'a major accident', 'River Road', 'This is a traffic update from CityRadio. There is a major accident on Highway 7 near exit 15. All lanes are blocked. Drivers are advised to take alternate routes via River Road.'],
    ['a quarterly town hall meeting', 'the CEO', 'a Q and A session', 'All employees are invited to the quarterly town hall meeting on Friday June 30th at 3 PM. The CEO will present results. There will be a Q and A session after. Light refreshments served.'],
    ['a beach cleanup event', 'at Sandy Beach', 'June 5th', 'We are looking for volunteers for the annual beach cleanup on Saturday June 10th. Volunteers will meet at Sandy Beach at 8 AM. Please sign up online by June 5th.'],
    ['a new payment option for vending', 'scan a QR code', 'the facilities team', 'The drink machine in the break room now accepts mobile payments. Scan the QR code with your phone. Please report malfunctions to the facilities team.'],
    ['a public holiday closure', 'on Friday', 'trash collection', 'Due to the public holiday on Thursday July 4th, all non-essential government offices will be closed. Regular hours resume Friday. Trash collection will be delayed by one day.'],
    ['an internship program', 'June through August', 'current college students', 'We are accepting applications for our internship program. The program runs from June through August. Applicants must be currently enrolled in a college or university.'],
    ['a fundraising gala', '$200,000', 'a live auction', 'Good evening and welcome to the City Hospital fundraising gala. Tonight we hope to raise $200,000 for the new children wing. There will be a live auction after dinner.'],
    ['a new performance review system', 'quarterly', 'to provide more timely feedback', 'Our company is implementing a new performance review system. Reviews will be conducted quarterly instead of annually. This aims to provide more timely feedback.'],
    ['a new team member', 'senior software engineer', 'mobile app development', 'Please welcome our newest team member, David Lee. He joins us as a senior software engineer. He will work on the mobile app development project.'],
    ['a budget planning meeting', 'all department heads', 'August 1st', 'The budget planning meeting for next fiscal year has been scheduled for August 15th at 10 AM. All department heads must attend. Submit proposals by August 1st.'],
    ['a grocery store promotion', '20 percent off', 'Friday to Sunday', 'This weekend only at Green Grocers. All organic fruits and vegetables are 20 percent off. Offer valid from Friday to Sunday. Members receive an additional 5 percent off.'],
    ['a personal introduction', 'an architect', 'two', 'hiking on weekends'],
    ['an innovation award', 'the R&D team', 'a trip to Berlin', 'The winner of this year innovation award is the research and development team. The award comes with $10,000 and a trip to the Tech Conference in Berlin.'],
    ['a weekend software upgrade', 'Saturday 8 PM to Sunday 6 AM', 'save work and log out', 'The company will conduct a software upgrade this weekend. The system will be unavailable from Saturday 8 PM to Sunday 6 AM. Please save your work and log out by Saturday 7 PM.'],
  ];
  for (const [topic, detail1, detail2, speech] of talks) {
    const q2text = typeof detail1 === 'string' && detail1.length > 40 ? detail1 : ('What is one detail mentioned?');
    lines.push(makeQ({ id: id++, part: 4, question: 'What is the announcement about?', options: [topic, 'A product launch', 'A company policy', 'A weather report'], answer: 'A', passage: speech }));
    lines.push(makeQ({ id: id++, part: 4, question: (typeof detail1 === 'string' && detail1.length > 40 ? 'What is mentioned?' : 'What is another key detail?'), options: [detail1.toString(), 'A date change', 'A price increase', 'A location move'], answer: 'A', passage: speech }));
    lines.push(makeQ({ id: id++, part: 4, question: 'What should listeners do?', options: [detail2.toString(), 'Ignore the announcement', 'Call for more information', 'Check the website'], answer: 'A', passage: speech }));
  }
  console.log('P4 done, id=' + (id - 1));
}

function P5() {
  const data = [
    ['The new employee orientation will be _____ by the HR department.', 'conducted', 'conducting', 'conducts', 'conduct'],
    ['All applicants must have a university degree _____ a related field.', 'in', 'on', 'at', 'for'],
    ['The company is _____ known for its customer service.', 'widely', 'wide', 'widen', 'widest'],
    ['Please _____ the attached document before the meeting.', 'review', 'reviewing', 'reviewed', 'reviews'],
    ['The contract _____ by the legal team before it was signed.', 'was reviewed', 'reviews', 'reviewing', 'review'],
    ['The manager was _____ with the teams performance.', 'pleased', 'pleasing', 'please', 'pleasant'],
    ['We are looking forward _____ hearing from you.', 'to', 'for', 'at', 'with'],
    ['The shipment was delayed _____ a strike at the port.', 'due to', 'because', 'due of', 'because that'],
    ['_____ you have any questions, please contact our support team.', 'Should', 'Would', 'Could', 'Must'],
    ['The report needs to be _____ before it can be submitted.', 'completed', 'completing', 'completes', 'complete'],
    ['The new policy will take _____ next month.', 'effect', 'affect', 'effort', 'afford'],
    ['The CEO _____ the new strategy at the meeting yesterday.', 'presented', 'presents', 'presenting', 'present'],
    ['_____ of the candidates had the required experience.', 'None', 'Neither', 'Any', 'Each'],
    ['The software _____ significantly since its release.', 'has improved', 'improves', 'improving', 'improved'],
    ['All employees are required _____ the safety training.', 'to attend', 'attending', 'attend', 'attended'],
    ['The company _____ a wide range of benefits to employees.', 'offers', 'offering', 'offered', 'offer'],
    ['The project was completed _____ schedule.', 'ahead of', 'before', 'in front', 'forward'],
    ['The meeting was _____ than we expected.', 'shorter', 'short', 'shortest', 'shortly'],
    ['The customer requested a _____ for the defective product.', 'refund', 'refunded', 'refunding', 'refunds'],
    ['We appreciate your _____ in this matter.', 'cooperation', 'cooperate', 'cooperative', 'cooperating'],
    ['The report must be submitted _____ Friday afternoon.', 'by', 'in', 'on', 'at'],
    ['The training program _____ for both new and experienced staff.', 'is designed', 'designs', 'designing', 'designed'],
    ['The database _____ regularly to ensure accuracy.', 'is updated', 'updates', 'updating', 'updated'],
    ['The new regulations will come _____ effect on January 1st.', 'into', 'in', 'to', 'at'],
    ['The marketing team _____ a new campaign for the product.', 'is developing', 'develop', 'developed', 'development'],
    ['Applicants should have strong communication _____.', 'skills', 'skilled', 'skillful', 'skillfully'],
    ['The server _____ down twice last week.', 'went', 'goes', 'has gone', 'was going'],
    ['The company is committed _____ reducing its environmental impact.', 'to', 'for', 'with', 'about'],
    ['_____ the two options, the committee chose the first one.', 'Between', 'Among', 'Within', 'Through'],
    ['The presentation _____ by the time the clients arrived.', 'had been prepared', 'was preparing', 'prepared', 'has prepared'],
    ['The HR department is _____ new staff for the project.', 'recruiting', 'recruited', 'recruit', 'recruitment'],
    ['The success of the project depends _____ teamwork.', 'on', 'for', 'with', 'about'],
    ['The network security _____ regularly to prevent breaches.', 'is checked', 'checks', 'checking', 'checked'],
    ['The candidates were _____ based on their experience.', 'selected', 'selecting', 'select', 'selection'],
    ['The proposal was rejected _____ it did not meet the budget.', 'because', 'although', 'however', 'therefore'],
    ['All visitors must _____ a valid ID at the security desk.', 'present', 'presenting', 'presented', 'presentation'],
    ['The _____ of the new branch will create jobs.', 'opening', 'open', 'opened', 'openly'],
    ['The company _____ its services to include international shipping.', 'has expanded', 'expands', 'expanding', 'expanded'],
    ['You will receive a confirmation email _____ you register.', 'after', 'unless', 'while', 'until'],
    ['The agreement will remain _____ for five years.', 'effective', 'effect', 'effectively', 'effects'],
    ['The deadline for submissions has been _____ to next week.', 'extended', 'extending', 'extends', 'extension'],
    ['Please ensure that all _____ are completed on time.', 'tasks', 'task', 'tasked', 'tasking'],
    ['The new policy will affect _____ departments.', 'all', 'every', 'each', 'both'],
    ['The financial report was _____ reviewed by the auditor.', 'carefully', 'careful', 'care', 'caring'],
    ['The production _____ due to equipment issues.', 'was halted', 'halted', 'halting', 'halts'],
    ['The two departments need to _____ more effectively.', 'collaborate', 'collaboration', 'collaborative', 'collaborating'],
    ['The annual budget must be _____ by the committee.', 'approved', 'approving', 'approves', 'approve'],
    ['Please do not hesitate _____ contact us.', 'to', 'from', 'with', 'for'],
    ['The sales team worked hard _____ meet their targets.', 'to', 'for', 'in', 'at'],
    ['The company _____ its 50th anniversary next year.', 'will celebrate', 'celebrated', 'celebrates', 'has celebrated'],
    ['The employee _____ the highest sales will receive a bonus.', 'who achieves', 'whom achieves', 'which achieves', 'whose achieves'],
    ['The equipment must be _____ before it can be used.', 'tested', 'testing', 'test', 'tests'],
    ['The training session _____ by a guest speaker.', 'will be led', 'will lead', 'is leading', 'leads'],
    ['The company policy requires all employees _____ a dress code.', 'to follow', 'follow', 'following', 'followed'],
    ['The client was _____ satisfied with the service.', 'completely', 'complete', 'completing', 'completed'],
    ['The report should be submitted in _____ with guidelines.', 'accordance', 'according', 'accords', 'accord'],
    ['The results of the survey will be _____ next week.', 'published', 'publishing', 'publish', 'publishes'],
    ['The manager expressed her _____ for the teams effort.', 'gratitude', 'grateful', 'gratefully', 'gratify'],
    ['The _____ of the new system will take place over the weekend.', 'installation', 'install', 'installing', 'installed'],
    ['The meeting was _____ productive than expected.', 'more', 'most', 'much', 'many'],
    ['The report contains a detailed _____ of market trends.', 'analysis', 'analyze', 'analytical', 'analyst'],
    ['The new employee has adapted _____ to the company culture.', 'well', 'good', 'fine', 'great'],
    ['The conference will be held _____ the Grand Plaza Hotel.', 'at', 'in', 'on', 'by'],
    ['We are pleased _____ that your application has been approved.', 'to inform', 'inform', 'informing', 'informed'],
    ['The manager was impressed _____ the teams performance.', 'with', 'about', 'for', 'by'],
    ['The _____ of the product was delayed due to testing.', 'launch', 'launched', 'launching', 'launches'],
    ['The company is _____ for its innovative products.', 'known', 'knowing', 'knows', 'knew'],
    ['Please confirm your attendance _____ replying to this email.', 'by', 'at', 'in', 'on'],
    ['The software license needs to be _____ annually.', 'renewed', 'renewing', 'renews', 'renewal'],
    ['The budget _____ by the finance director last week.', 'was approved', 'approved', 'approves', 'approving'],
    ['The company _____ generous retirement benefits.', 'provides', 'providing', 'provided', 'provide'],
    ['The meeting was _____ due to a scheduling conflict.', 'postponed', 'postponing', 'postpones', 'postpone'],
    ['All participants _____ complete the registration form.', 'must', 'should', 'would', 'could'],
    ['The system _____ down for maintenance last night.', 'was', 'has been', 'had been', 'is being'],
    ['The employee handbook contains all company _____ and procedures.', 'policies', 'policy', 'police', 'polite'],
    ['The contractor will begin construction _____ next month.', 'in', 'on', 'at', 'by'],
    ['The CEO thanked everyone for their hard work and _____.', 'dedication', 'dedicated', 'dedicate', 'dedicating'],
    ['The company has _____ its workforce by 20 percent.', 'expanded', 'expanding', 'expands', 'expand'],
    ['The IT department is responsible _____ network maintenance.', 'for', 'to', 'with', 'about'],
    ['The document needs to be _____ by the legal team.', 'reviewed', 'reviewing', 'reviews', 'review'],
    ['Applicants must have at least three years of _____ experience.', 'relevant', 'relevance', 'relevantly', 'relieve'],
    ['The package _____ delivered yesterday afternoon.', 'was', 'has', 'had', 'is'],
    ['The manager asked everyone _____ their best effort.', 'to give', 'give', 'giving', 'given'],
    ['The office will be closed _____ Monday for the holiday.', 'on', 'in', 'at', 'by'],
    ['We are committed _____ providing quality service.', 'to', 'for', 'with', 'about'],
    ['The new marketing strategy was _____ by the board.', 'approved', 'approving', 'approves', 'approve'],
    ['The report _____ that sales have increased.', 'shows', 'showing', 'showed', 'shown'],
    ['Customers are asked _____ their receipts when picking up orders.', 'to present', 'present', 'presenting', 'presented'],
    ['The _____ conference was a great success.', 'annual', 'annually', 'annals', 'annuity'],
    ['The team leader is _____ for coordinating the project.', 'responsible', 'response', 'responsive', 'respond'],
    ['The sales figures _____ a significant improvement.', 'show', 'shows', 'showing', 'shown'],
    ['The company values _____ and creativity.', 'innovation', 'innovate', 'innovative', 'innovating'],
    ['The documents _____ to the client yesterday.', 'were sent', 'sent', 'are sent', 'have sent'],
    ['The project is expected to be completed _____ six months.', 'within', 'through', 'across', 'among'],
    ['The HR department will _____ the training workshop.', 'organize', 'organizes', 'organizing', 'organized'],
    ['The employee _____ the award at the ceremony.', 'received', 'receives', 'receiving', 'receive'],
    ['The new branch office is _____ in the business district.', 'located', 'locating', 'locates', 'location'],
    ['Please _____ the attached files for your reference.', 'see', 'saw', 'seen', 'seeing'],
    ['The agreement _____ both parties must sign.', 'requires', 'requiring', 'required', 'require'],
    ['The factory _____ operations in 1995.', 'began', 'begins', 'beginning', 'begun'],
    ['The customer service team _____ inquiries by phone and email.', 'handles', 'handling', 'handled', 'handle'],
    ['The training program covers a _____ of topics.', 'variety', 'vary', 'various', 'varied'],
    ['The company policy prohibits _____ in the office.', 'smoking', 'smoke', 'smoked', 'smokes'],
    ['The _____ of the new website will be completed next week.', 'development', 'develop', 'developing', 'developed'],
    ['All employees are encouraged to _____ in the wellness program.', 'participate', 'participation', 'participating', 'participated'],
    ['The financial report must be _____ by the end of the month.', 'submitted', 'submitting', 'submits', 'submit'],
    ['The company has seen _____ growth this quarter.', 'significant', 'significantly', 'significance', 'signify'],
    ['The manager will _____ the team on the new project.', 'brief', 'briefly', 'briefing', 'briefs'],
  ];
  for (const [q, a, b, c, d] of data) {
    lines.push(makeQ({ id: id++, part: 5, question: q, options: [a, b, c, d], answer: 'A' }));
  }
  console.log('P5 done, id=' + (id - 1));
}

function P6() {
  const texts = [
    { title: 'NOTICE TO ALL EMPLOYEES', body: 'To: All Staff\n\nThis is to inform you that the office will be closed on Monday July 4th in observance of Independence Day. Regular business hours will _____ on Tuesday at 9 AM. If you need immediate assistance during the holiday, please contact the emergency hotline. We wish everyone a safe and _____ holiday. Your cooperation is greatly _____. Please mark your _____ accordingly.', b: ['resume', 'cancel', 'delay', 'stop', 'enjoyable', 'busy', 'long', 'quiet', 'appreciated', 'required', 'expected', 'demanded', 'calendars', 'tasks', 'plans', 'schedule'] },
    { title: 'Product Launch', body: 'We are thrilled to announce the launch of our new smartwatch, the FitTrack Pro. This device _____ users to monitor their health metrics in real time. The smartwatch comes with a variety of features including heart rate monitoring and sleep tracking. Pre-orders begin on March 1st with a special _____ price of $199. Customers who pre-order will receive a free _____ band. This offer is available for a _____ time only.', b: ['allows', 'forces', 'prevents', 'stops', 'introductory', 'regular', 'premium', 'final', 'silicone', 'leather', 'metal', 'fabric', 'limited', 'extended', 'fixed', 'certain'] },
    { title: 'Customer Appreciation Event', body: 'Dear Valued Customers,\n\nWe would like to invite you to our annual Customer Appreciation Day on Saturday June 17th. The event will take _____ at our main branch from 10 AM to 4 PM. There will be special discounts giveaways and refreshments. We look forward to _____ you there. Please RSVP by June 10th to ensure your _____. We hope you can _____ us for this celebration.', b: ['place', 'part', 'time', 'care', 'seeing', 'visiting', 'meeting', 'helping', 'spot', 'seat', 'turn', 'chance', 'join', 'leave', 'miss', 'avoid'] },
    { title: 'MEMORANDUM', body: 'TO: All Department Heads\nFROM: Human Resources\nDATE: May 1st\n\nPlease be advised that the deadline for submitting performance reviews has been extended to May 20th. This _____ allows managers more time to complete thorough evaluations. All reviews must be submitted through the online portal. Late _____ may result in delayed salary adjustments. Please _____ the HR department if you have any questions. We appreciate your cooperation in this important _____.', b: ['extension', 'reduction', 'cancellation', 'limitation', 'submissions', 'payments', 'arrivals', 'departures', 'contact', 'visit', 'call', 'email', 'matter', 'issue', 'project', 'case'] },
    { title: 'Workshop Registration', body: 'Join our Professional Development Workshop on Public Speaking. The workshop will be held on Saturday August 12th from 9 AM to 4 PM. The registration fee of $200 includes all materials and lunch. Space is _____, so early registration is recommended. To register, please complete the online form by August 5th. You will receive a _____ email within 48 hours. If you have special dietary _____, please inform us when registering.', b: ['limited', 'unlimited', 'plentiful', 'abundant', 'confirmation', 'cancellation', 'payment', 'reminder', 'requirements', 'preferences', 'requests', 'instructions', 'allergies', 'needs', 'wants', 'orders'] },
    { title: 'Fleet Vehicle Policy', body: 'This policy applies to all company vehicles. Employees _____ to use a company vehicle must hold a valid drivers license. Vehicles must be returned with a full tank of fuel. Any traffic violations are the _____ of the employee. Regular _____ is required every 6 months. All accidents must be _____ to the fleet manager within 24 hours.', b: ['authorized', 'forbidden', 'required', 'asked', 'responsibility', 'benefit', 'privilege', 'choice', 'maintenance', 'cleaning', 'inspection', 'service', 'reported', 'recorded', 'submitted', 'documented'] },
    { title: 'Quarterly Results', body: 'We are pleased to announce our quarterly results. Revenue increased by 12 percent compared to the same period last year. Operating expenses were reduced by 8 percent due to cost-saving _____. Net profit reached $3.2 million. We are _____ with these results. However we must remain focused on our _____ goals. The next quarter will be _____ for our growth.', b: ['measures', 'problems', 'failures', 'delays', 'satisfied', 'disappointed', 'concerned', 'surprised', 'strategic', 'financial', 'annual', 'short-term', 'critical', 'optional', 'minor', 'simple'] },
    { title: 'Airline Baggage Policy', body: 'We would like to inform passengers of an update to our baggage policy. Effective next month, carry-on luggage must not exceed 55cm by 40cm by 20cm. _____ baggage allowance remains at two pieces per passenger. Passengers who exceed the size _____ will need to check their bags at the gate. An _____ fee will apply for checked bags at the gate. We recommend arriving at the airport _____ to allow sufficient time.', b: ['Checked', 'Carry-on', 'Personal', 'Excess', 'limits', 'costs', 'fees', 'rules', 'additional', 'extra', 'waived', 'reduced', 'early', 'late', 'on time', 'daily'] },
    { title: 'New Fitness Program', body: 'We are excited to introduce our new employee fitness program. Starting next month, employees can _____ free fitness classes held every Tuesday and Thursday at 5 PM. Classes include yoga, pilates, and aerobics. All _____ levels are welcome. No prior experience is needed. Please bring your own _____ and water. Classes will be held in the _____ room on the second floor.', b: ['attend', 'miss', 'skip', 'avoid', 'fitness', 'education', 'skill', 'difficulty', 'yoga mat', 'towel', 'notebook', 'phone', 'multipurpose', 'conference', 'training', 'meeting'] },
    { title: 'Annual Conference', body: 'We are pleased to announce our annual industry conference on September 20th. This years theme is Digital Transformation. Early bird registration is available _____ July 31st. The conference will feature keynote speakers from leading technology companies. Dont miss this opportunity to _____ with industry leaders. The conference fee includes access to all _____. Lunch will also be _____.', b: ['until', 'from', 'after', 'before', 'network', 'compete', 'compare', 'struggle', 'sessions', 'meals', 'materials', 'events', 'provided', 'included', 'served', 'offered'] },
    { title: 'Volunteer Opportunity', body: 'The Community Garden Project is seeking volunteers for the spring planting season. Volunteers will help plant vegetables and flowers in community gardens across the city. No gardening _____ is required. Tools and gloves will be provided. Volunteers should wear comfortable clothing and bring a water _____. The project runs every Saturday in _____. Please sign up at least one week in _____.', b: ['experience', 'education', 'training', 'certificate', 'bottle', 'snack', 'hat', 'towel', 'April', 'March', 'May', 'June', 'advance', 'early', 'late', 'time'] },
    { title: 'Hotel Review Response', body: 'Dear Mr. Thompson,\n\nThank you for taking the time to share your feedback about your recent stay at our hotel. We are pleased to hear that you enjoyed the amenities and the location. However, we _____ for the noise issues you experienced during your stay. We have taken steps to address this problem. We hope to have the opportunity to welcome you back in the _____. As a gesture of goodwill, we would like to offer you a _____ on your next stay. We value your _____ as a guest.', b: ['apologize', 'thank', 'commend', 'appreciate', 'future', 'past', 'meantime', 'end', 'discount', 'upgrade', 'gift', 'refund', 'patronage', 'business', 'feedback', 'loyalty'] },
    { title: 'Company Picnic', body: 'The annual company picnic will be held on Saturday July 22nd at Riverside Park from 11 AM to 4 PM. There will be a barbecue lunch, games, and prizes. Employees are welcome to _____ their families. Please RSVP by July 10th so we can finalize the _____. Transportation will be provided from the office _____ at 10:30 AM. In case of bad weather the event will be moved to the _____.', b: ['bring', 'leave', 'send', 'invite', 'catering', 'schedule', 'location', 'budget', 'parking lot', 'lobby', 'entrance', 'driveway', 'community center', 'park', 'office', 'hotel'] },
    { title: 'Software Update Notice', body: 'The accounting software will be updated this weekend. The system will be _____ from Saturday 6 PM to Sunday 6 AM. All users must save their work and log out before the update begins. After the update, users may need to _____ their computers. Please contact IT if you _____ any issues. We apologize for any _____ this may cause.', b: ['unavailable', 'available', 'operational', 'accessible', 'restart', 'replace', 'remove', 'return', 'experience', 'ignore', 'expect', 'avoid', 'inconvenience', 'delay', 'problem', 'confusion'] },
    { title: 'Customer Satisfaction Survey', body: 'We value your opinion. Please take a few minutes to complete our customer satisfaction survey. Your _____ will help us improve our services. As a token of our appreciation, all participants will be entered into a drawing to win a $100 gift _____. The survey takes approximately 5 minutes to _____. Your responses will be kept strictly _____.', b: ['feedback', 'payment', 'order', 'complaint', 'card', 'certificate', 'basket', 'coupon', 'complete', 'start', 'finish', 'read', 'confidential', 'private', 'secret', 'anonymous'] },
    { title: 'New Office Furniture', body: 'We are pleased to announce that new ergonomic chairs will be installed in all workspaces by the end of this month. These chairs are _____ to provide better back support and improve posture. An _____ team will visit each department to adjust the chairs to individual preferences. The old chairs will be _____ to a local charity. We believe this _____ will improve workplace comfort significantly.', b: ['designed', 'bought', 'ordered', 'delivered', 'installation', 'repair', 'cleaning', 'management', 'donated', 'sold', 'returned', 'recycled', 'initiative', 'investment', 'change', 'policy'] },
  ];
  for (const t of texts) {
    const b = t.b;
    for (let i = 0; i < 4; i++) {
      const idx = i * 4;
      lines.push(makeQ({
        id: id++, part: 6, question: '_____',
        options: [b[idx], b[idx + 1], b[idx + 2], b[idx + 3]],
        answer: 'A',
        passage: t.body,
        passageTitle: t.title,
        passageBody: t.body,
      }));
    }
  }
  console.log('P6 done, id=' + (id - 1));
}

function P7() {
  const passages = [
    { title: 'Staff Meeting Notice', body: 'There will be a staff meeting on Friday June 9th at 2 PM in Conference Room A. All department heads must attend. The agenda includes the quarterly review and upcoming project plans. Please come prepared with your department updates.', qs: ['When is the staff meeting?', 'Friday June 9th at 2 PM', 'Friday June 9th at 1 PM', 'Thursday June 8th at 2 PM', 'Friday June 16th at 2 PM', 'Who must attend?', 'All department heads', 'All employees', 'New staff only', 'The board members', 'What should attendees bring?', 'Department updates', 'Laptops', 'Reports', 'Refreshments'] },
    { title: 'Membership Benefits', body: 'Become a Gold Member today and enjoy exclusive benefits. Members receive 10 percent off all purchases, free shipping on online orders, and early access to sales. Annual membership is $50. Sign up online or at any store location.', qs: ['What is being promoted?', 'A Gold Membership program', 'A seasonal sale', 'A new product line', 'A store opening', 'What discount do members receive?', '10 percent off purchases', '15 percent off purchases', '20 percent off purchases', '5 percent off purchases', 'How much does annual membership cost?', '$50', '$40', '$60', '$30'] },
    { title: 'Apartment Rental', body: 'Modern one-bedroom apartment available for rent in the city center. Features include a full kitchen, hardwood floors, and a balcony. Building amenities include a gym and laundry facilities. Monthly rent is $1,200 including water. Available immediately. No smokers. Call 555-0123 for a viewing.', qs: ['What type of apartment?', 'One-bedroom', 'Two-bedroom', 'Studio', 'Penthouse', 'What is NOT included in amenities?', 'Parking', 'Gym', 'Laundry', 'Balcony', 'What number to call?', '555-0123', '555-0124', '555-0321', '555-0120'] },
    { title: 'Workshop Announcement', body: 'The IT department is offering a workshop on Data Security Best Practices. The workshop will be held on Wednesday July 12th from 10 AM to 12 PM in Training Room B. All employees who handle sensitive data are encouraged to attend. Seating is limited to 25 participants.', qs: ['What is the workshop about?', 'Data Security Best Practices', 'Software Development', 'Network Administration', 'Cloud Computing', 'How long is the workshop?', '2 hours', '3 hours', '1 hour', 'Half day', 'How many participants?', '25', '30', '20', '15'] },
    { title: 'Product Recall Notice', body: 'IMPORTANT: We are voluntarily recalling Model B-100 air purifiers sold between January and March. A manufacturing defect may cause the unit to overheat. Consumers should immediately unplug the unit and contact customer service at 555-9876 for a full refund.', qs: ['Why is the product recalled?', 'It may overheat', 'It is noisy', 'It uses too much power', 'It is hard to use', 'Which models are recalled?', 'Model B-100', 'Model A-100', 'Model B-200', 'Model C-100', 'What should consumers do?', 'Unplug the unit', 'Return to store', 'Call the police', 'Throw it away'] },
    { title: 'Weekly Specials', body: 'This week at FreshMart: All organic vegetables are 25 percent off. Fresh salmon is $12.99 per pound. Buy one loaf of artisan bread and get the second free. Store hours are 8 AM to 9 PM daily. Prices valid through Sunday.', qs: ['Which store has specials?', 'FreshMart', 'GreenGrocers', 'FreshBites', 'MarketPlace', 'What is the salmon price?', '$12.99/lb', '$10.99/lb', '$14.99/lb', '$9.99/lb', 'When do prices expire?', 'Sunday', 'Saturday', 'Friday', 'Monday'] },
    { title: 'Flight Delay Notice', body: 'This is an update regarding Flight AC 123 to Vancouver. Due to mechanical issues the flight has been delayed by approximately 2 hours. The new departure time is 5:30 PM. Affected passengers will receive meal vouchers. We apologize for the inconvenience.', qs: ['What is the flight number?', 'AC 123', 'AC 132', 'CA 123', 'AC 321', 'Why was the flight delayed?', 'Mechanical issues', 'Bad weather', 'Crew scheduling', 'Air traffic', 'What will passengers receive?', 'Meal vouchers', 'Hotel rooms', 'Travel credits', 'Priority boarding'] },
    { title: 'Volunteer Opportunity', body: 'The Community Food Bank is seeking volunteers for our annual food drive on Saturday May 20th. Volunteers are needed for two shifts: 9 AM to 12 PM and 1 PM to 4 PM. Duties include sorting donations, packing food boxes, and assisting visitors. Sign up online.', qs: ['Which organization needs volunteers?', 'Community Food Bank', 'Red Cross', 'City Library', 'Animal Shelter', 'How many shifts are available?', 'Two shifts', 'One shift', 'Three shifts', 'Four shifts', 'What is NOT a duty?', 'Cooking meals', 'Sorting donations', 'Packing boxes', 'Assisting visitors'] },
    { title: 'Shipping Policy Update', body: 'We now offer free standard shipping on all orders over $50. Express shipping is available for an additional $12.99. Orders placed before 2 PM are shipped the same business day. Delivery times vary by location.', qs: ['What is the new policy?', 'Free shipping over $50', 'Free shipping on all orders', 'Free express shipping', 'Reduced international rates', 'How much is express shipping?', '$12.99', '$9.99', '$15.99', 'Free', 'When are same-day orders shipped?', 'Before 2 PM', 'Before 12 PM', 'Before 10 AM', 'All orders'] },
    { title: 'Newsletter Subscription', body: 'Thank you for subscribing to TechWeekly newsletter. You will receive the latest technology news and product reviews every Monday morning. As a welcome bonus you will receive a free e-book on digital marketing trends. Unsubscribe link is at the bottom of each email.', qs: ['What is TechWeekly?', 'A newsletter', 'A magazine', 'A podcast', 'A blog', 'How often is it sent?', 'Weekly', 'Daily', 'Monthly', 'Bi-weekly', 'What bonus do subscribers get?', 'A free e-book', 'A discount coupon', 'A free trial', 'A gift card'] },
    { title: 'Parking Garage Notice', body: 'The parking garage will be closed for cleaning on Sunday June 11th from 7 AM to 3 PM. All vehicles must be removed by 6:30 AM. The overflow lot on Oak Street will be available. Shuttle service runs every 20 minutes between the overflow lot and the main building.', qs: ['Why is the garage closed?', 'For cleaning', 'For maintenance', 'For construction', 'For an event', 'When must vehicles be removed?', '6:30 AM', '7 AM', '6 AM', '8 AM', 'How often does the shuttle run?', 'Every 20 minutes', 'Every 15 minutes', 'Every 30 minutes', 'Every 10 minutes'] },
    { title: 'Promotional Offer', body: 'Buy one get one free on all coffee drinks this weekend at BrewBrew Cafe. Offer valid Saturday and Sunday during regular business hours. Limit one per customer per visit. Present this email at the counter to redeem. Follow us on social media for more deals.', qs: ['What is the promotion?', 'BOGO on coffee drinks', '50% off all drinks', 'Free pastry with coffee', 'Half price on lattes', 'When is it valid?', 'Saturday and Sunday', 'Weekdays only', 'All week', 'Friday only', 'How to redeem?', 'Present this email', 'Show a coupon', 'Use a code', 'Scan a QR code'] },
    { title: 'Seminar Registration', body: 'Join us for a half-day seminar on Effective Time Management on Saturday April 22nd from 9 AM to 12 PM at the City Convention Center. Registration fee is $75 and includes materials and a certificate. Space is limited to 50 participants. Register by April 15th.', qs: ['What is the seminar about?', 'Time management', 'Public speaking', 'Team building', 'Leadership', 'How much does it cost?', '$75', '$50', '$100', '$60', 'How many participants?', '50', '30', '100', '75'] },
    { title: 'Donation Request', body: 'The City Animal Shelter is asking for donations of pet food, blankets, and toys. Items can be dropped off at 123 Oak Avenue between 9 AM and 6 PM daily. Monetary donations are also accepted through our website.', qs: ['Which organization is asking?', 'City Animal Shelter', 'Community Food Bank', 'Red Cross', 'Children Hospital', 'What items are NOT mentioned?', 'Pet clothing', 'Pet food', 'Blankets', 'Toys', 'How to donate money?', 'Through the website', 'By mail', 'In person', 'By phone'] },
    { title: 'Appointment Reminder', body: 'This is a reminder of your dental appointment scheduled for Thursday May 25th at 2:30 PM with Dr. Park. Please arrive 15 minutes early to complete paperwork. If you need to reschedule, call our office at least 24 hours in advance.', qs: ['What appointment is this?', 'Dental appointment', 'Medical checkup', 'Eye exam', 'Hair appointment', 'Who is the doctor?', 'Dr. Park', 'Dr. Kim', 'Dr. Lee', 'Dr. Chen', 'How early to arrive?', '15 minutes', '10 minutes', '20 minutes', '30 minutes'] },
    { title: 'Car Rental Agreement', body: 'Thank you for choosing DriveEasy Car Rental. Your rental includes unlimited mileage, comprehensive insurance, and 24/7 roadside assistance. Minimum rental age is 21. All vehicles must be returned with a full tank of fuel. Late returns will be charged an additional day fee.', qs: ['What is included?', 'Unlimited mileage and insurance', 'GPS navigation', 'Free fuel', 'Car seat', 'What is the minimum age?', '21 years old', '25 years old', '18 years old', '23 years old', 'What happens for late returns?', 'Additional day fee', 'Warning issued', 'Suspension', 'Insurance voided'] },
    { title: 'Library Notice', body: 'Starting June 1st the city library will operate on summer hours. Monday through Friday 9 AM to 7 PM, Saturdays 10 AM to 5 PM. Closed on Sundays. Regular hours resume September 1st.', qs: ['What is this notice about?', 'Summer hours', 'Book sale', 'New membership', 'Renovation', 'What are Saturday hours?', '10 AM to 5 PM', '9 AM to 7 PM', '10 AM to 6 PM', '9 AM to 5 PM', 'When do regular hours resume?', 'September 1st', 'June 1st', 'July 1st', 'August 1st'] },
    { title: 'Fitness Promotion', body: 'Join FitLife Gym this month and receive 50 percent off your first three months. Our facility includes a swimming pool, basketball court, group fitness classes, and full range of equipment. No initiation fee. Offer valid until end of month.', qs: ['What is the promotion?', '50% off first 3 months', 'Free month', 'Half off initiation', 'Free personal training', 'What is NOT included?', 'Tennis court', 'Swimming pool', 'Basketball court', 'Fitness classes', 'When does the offer end?', 'End of month', 'End of week', 'End of year', 'End of quarter'] },
    { title: 'Customer Survey', body: 'Thank you for participating in our customer satisfaction survey. Overall satisfaction increased by 15 percent. Highest rated: staff friendliness at 94 percent. Area needing improvement: response time at 78 percent. We are working on improvements.', qs: ['How much did satisfaction increase?', '15 percent', '10 percent', '20 percent', '5 percent', 'What was highest rated?', 'Staff friendliness', 'Product quality', 'Pricing', 'Website', 'What needs improvement?', 'Response time', 'Product quality', 'Pricing', 'Website usability'] },
    { title: 'Special Offer', body: 'This week only enjoy 30 percent off all wireless headphones at SoundWave Electronics. Noise-canceling headphones for work or comfortable earbuds for workouts. Valid in-store and online. Use code SOUND30 at checkout.', qs: ['What is on sale?', 'Wireless headphones', 'Bluetooth speakers', 'Smart watches', 'Phone cases', 'What is the discount code?', 'SOUND30', 'SOUND20', 'WAVE30', 'ELECTRONICS', 'Where is it valid?', 'In-store and online', 'Online only', 'In-store only', 'App only'] },
    { title: 'Tour Information', body: 'Welcome to the Mountain Ridge hiking tour. Please stay on marked trails at all times. The cliffs along the eastern path are very steep so exercise caution. Carry enough water as there are no facilities on the trail. We will stop for a rest at the halfway point.', qs: ['What is the guide warning about?', 'Steep cliffs', 'Bad weather', 'Wildlife', 'Pickpockets', 'What should hikers bring?', 'Enough water', 'First aid kit', 'Snacks', 'A map', 'Why are there no facilities?', 'Remote area', 'Under renovation', 'Closed for season', 'Staff only'] },
    { title: 'Company Anniversary', body: 'On July 15th we celebrate our company 25th anniversary. All employees are invited to a celebration at the City Garden Hotel from 6 PM to 10 PM. The evening includes dinner, entertainment, and recognition of long-serving employees. RSVP to HR by July 1st.', qs: ['Why the celebration?', '25th anniversary', 'Major contract', 'New office', 'Product launch', 'Where is the celebration?', 'City Garden Hotel', 'Main office', 'Convention Center', 'City Park', 'When is the RSVP deadline?', 'July 1st', 'July 15th', 'June 15th', 'June 1st'] },
    { title: 'Customer Feedback', body: 'I ordered a laptop from your website on May 10th. The website said delivery would take 3-5 business days. However I received the package on May 20th, five days after the estimated date. The laptop itself is fine but the delay caused inconvenience. I would appreciate a partial refund for shipping.', qs: ['What is the main complaint?', 'Late delivery', 'Poor quality', 'Wrong item', 'Rude service', 'When was the order placed?', 'May 10th', 'May 15th', 'May 20th', 'May 5th', 'What compensation is suggested?', 'Partial shipping refund', 'Replacement product', 'Discount on next purchase', 'Extended warranty'] },
    { title: 'Express Rail Service', body: 'The new Express Rail service between City Center and Riverside begins April 1st. The journey takes just 25 minutes, half the time of regular service. Trains run every 30 minutes during peak hours. One-way ticket costs $12 with discounts for monthly pass holders.', qs: ['What service is described?', 'Express Rail service', 'Bus service', 'Ferry service', 'Subway service', 'How long is the journey?', '25 minutes', '50 minutes', '30 minutes', '45 minutes', 'How much is a one-way ticket?', '$12', '$10', '$15', '$8'] },
    { title: 'Work-from-Home Policy', body: 'Effective June 1st, employees in selected departments may work from home up to two days per week. Eligibility requires at least six months of employment and manager approval. Remote work days must be scheduled in advance using the online system.', qs: ['What is this document about?', 'Work-from-home policy', 'New vacation policy', 'Expense policy', 'Performance policy', 'How many WFH days per week?', 'Up to two days', 'Up to three days', 'Up to one day', 'Up to four days', 'What is a requirement?', 'Six months employment', 'None of the above', 'Both six months and manager approval', 'Manager approval only'] },
    { title: 'Restaurant Review', body: 'I visited La Maison last weekend and was thoroughly impressed. The atmosphere was elegant and welcoming, and the service was impeccable. The chef tasting menu was a culinary journey through French cuisine. While expensive, the quality makes it worth the price.', qs: ['What is the overall opinion?', 'Very positive', 'Somewhat negative', 'Neutral', 'Very negative', 'What did the reviewer enjoy?', 'The tasting menu', 'The desserts', 'The lunch menu', 'The appetizers', 'What criticism is mentioned?', 'The high price', 'The slow service', 'The small portions', 'The noisy atmosphere'] },
    { title: 'Building Notice', body: 'Please be advised that the water supply to the building will be turned off on Saturday April 22nd from 8 AM to 5 PM for scheduled maintenance. We recommend that all tenants store enough water for the day. If you have questions, contact the building management office.', qs: ['Why is the water off?', 'Scheduled maintenance', 'Broken pipe', 'Construction', 'Weather', 'How long will it be off?', '9 hours', '8 hours', '10 hours', '6 hours', 'Who to contact?', 'Building management', 'City water dept', 'Maintenance company', 'Landlord'] },
    { title: 'Job Posting', body: 'Position: Senior Accountant. Requirements: CPA certification and 5 years of experience. Responsibilities include preparing financial statements, managing budgets, and coordinating with auditors. Competitive salary and benefits. Apply online by June 15th.', qs: ['What position is this?', 'Senior Accountant', 'Marketing Manager', 'Software Developer', 'Admin Assistant', 'What certification is required?', 'CPA', 'MBA', 'CFA', 'PMP', 'How many years experience?', '5 years', '7 years', '10 years', '3 years'] },
    { title: 'Product Warranty', body: 'Thank you for purchasing the SoundWave Bluetooth Speaker. This product comes with a one-year limited warranty covering manufacturing defects. Warranty does not cover misuse or accidents. Register your product online within 30 days to activate. Keep your receipt as proof of purchase.', qs: ['What product is this for?', 'Bluetooth speaker', 'Smartphone', 'Laptop', 'Television', 'How long is the warranty?', 'One year', 'Two years', 'Six months', '90 days', 'What must customers do?', 'Register online', 'Return receipt', 'Call customer service', 'Send an email'] },
    { title: 'Conference Schedule', body: 'Dear Attendees, We have an update to the conference schedule. The keynote speech has been moved from 9 AM to 10 AM. Lunch will now be served in the Grand Ballroom instead of the lobby. The afternoon breakout sessions remain unchanged. Thank you for your understanding.', qs: ['What changed?', 'The schedule', 'The venue', 'The speaker', 'The registration', 'What time is the keynote now?', '10 AM', '9 AM', '11 AM', '2 PM', 'Where will lunch be served?', 'Grand Ballroom', 'Lobby', 'Breakout rooms', 'Cafeteria'] },
    { title: 'Employee Training', body: 'All sales staff are required to attend a product training session on the new X200 model. The training will be held on Wednesday March 15th from 1 PM to 4 PM in Training Room C. A light lunch will be provided. RSVP to your department manager by March 10th.', qs: ['Who must attend?', 'Sales staff', 'All employees', 'Managers', 'New hires', 'How long is the training?', '3 hours', '2 hours', '4 hours', '1 hour', 'When is the RSVP deadline?', 'March 10th', 'March 15th', 'March 12th', 'March 8th'] },
    { title: 'Hotel Confirmation', body: 'Dear Mr. Johnson, This confirms your reservation for a Deluxe Ocean View Room at the Grand Beach Hotel from July 5th to July 8th. The rate is $250 per night including complimentary breakfast. Check-in is at 3 PM. We look forward to your stay.', qs: ['What type of room?', 'Deluxe Ocean View', 'Standard Room', 'Suite', 'Penthouse', 'How many nights?', '3 nights', '2 nights', '4 nights', '5 nights', 'What is included?', 'Complimentary breakfast', 'Free parking', 'Airport shuttle', 'Spa access'] },
    { title: 'Meeting Announcement', body: 'There will be a staff meeting on Thursday May 18th at 3:30 PM in Conference Room B. All department heads are required to attend. We will discuss the quarterly results and upcoming projects. Please come prepared with your department updates.', qs: ['What is this about?', 'A staff meeting', 'A training session', 'A team outing', 'A policy change', 'Who must attend?', 'Department heads', 'All employees', 'New hires', 'Interns', 'What will be discussed?', 'Quarterly results and projects', 'New product launch', 'Budget cuts', 'Hiring plans'] },
    { title: 'Office Hours', body: 'Our office hours are Monday through Friday 9 AM to 5 PM. Closed on weekends and public holidays. For after-hours support, please leave a message and we will return your call on the next business day.', qs: ['What are the office hours?', '9 AM to 5 PM Mon-Fri', '8 AM to 6 PM Mon-Fri', '9 AM to 5 PM Mon-Sat', '10 AM to 4 PM Mon-Fri', 'What if a customer calls after hours?', 'They can leave a message', 'Transferred to another line', 'Schedule a callback', 'Redirected to website', 'When will calls be returned?', 'Next business day', 'Same day', 'Within 24 hours', 'On Monday'] },
  ];
  for (const p of passages) {
    const qs = p.qs;
    lines.push(makeQ({ id: id++, part: 7, question: qs[0], options: [qs[1], qs[2], qs[3], qs[4]], answer: 'A', passage: p.body, passageTitle: p.title, passageBody: p.body }));
    lines.push(makeQ({ id: id++, part: 7, question: qs[5], options: [qs[6], qs[7], qs[8], qs[9]], answer: 'A', passage: p.body, passageTitle: p.title, passageBody: p.body }));
    lines.push(makeQ({ id: id++, part: 7, question: qs[10], options: [qs[11], qs[12], qs[13], qs[14]], answer: 'A', passage: p.body, passageTitle: p.title, passageBody: p.body }));
  }
  console.log('P7 done, id=' + (id - 1));
}

// Generate all parts
P1();
P2();
P3();
P4();
P5();
P6();
P7();

// Write output
fs.writeFileSync('output-lines.txt', lines.join(',\n'), 'utf8');
console.log('Total lines generated: ' + lines.length);
console.log('Final ID: ' + (id - 1));
