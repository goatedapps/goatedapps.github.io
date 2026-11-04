const TRIP_DAYS = [
  { date: '25 Nov', weekday: 'Wednesday', place: 'Singapore → JB → KL', title: 'All aboard, adventurers.', short: 'Train day', stay: 'Berjaya Times Square', theme: 'rail', items: [
    { time: '09:45', title: 'Singapore → Johor Bahru', note: 'Shuttle Tebrau train', kind: 'Train' },
    { time: '09:50', title: 'Hello, JB!', note: 'Breakfast at Oriental Kopi', kind: 'Breakfast' },
    { time: '12:45', title: 'Johor Bahru → Kuala Lumpur', note: 'Settle in for the train ride to KL.', kind: 'Train' },
    { time: '17:05', title: 'Hello, Kuala Lumpur!', note: 'Taxi to Berjaya Times Square hotel and check in.', kind: 'Arrival' },
    { time: 'Dinner', title: 'Tangkak Beef Noodle House', note: 'A warm bowl to start the holiday.', kind: 'Food' },
    { time: 'After dinner', title: 'A little wander', note: 'Supermarket browsing, then Mixue at Level 2.', kind: 'Explore' }
  ] },
  { date: '26 Nov', weekday: 'Thursday', place: 'Kuala Lumpur', title: 'Downhill. Big smiles.', short: 'Luge day', stay: 'Berjaya Times Square', theme: 'luge', items: [
    { time: 'Breakfast', title: 'Fuel up at the hotel', note: 'Hotel breakfast before the adventure.', kind: 'Breakfast' },
    { time: 'Daytime', title: 'Skyline Luge!', note: 'Choose your ride package on the day.', kind: 'Adventure', options: ['RM90 · 5 rides', 'RM125 · Unlimited rides', 'RM175 · Unlimited rides + zipline'] },
    { time: 'Dinner', title: 'Vivo Pizza', note: 'At Berjaya Times Square.', kind: 'Food' }
  ] },
  { date: '27 Nov', weekday: 'Friday', place: 'Kuala Lumpur', title: 'Crack the code.', short: 'Escape quest', stay: 'Berjaya Times Square', theme: 'escape', items: [
    { time: 'Breakfast', title: 'Hotel breakfast', note: 'Get the team ready.', kind: 'Breakfast' },
    { time: '11:45', title: 'Breakout Escape Room', note: 'Nu Sentral · Take a taxi.', kind: 'Puzzle', booked: true },
    { time: 'Lunch', title: 'Dolly Dim Sum', note: 'At Nu Sentral.', kind: 'Food' },
    { time: 'Dinner', title: 'Tea Garden', note: 'At Berjaya Times Square.', kind: 'Food' }
  ] },
  { date: '28 Nov', weekday: 'Saturday', place: 'Kuala Lumpur', title: 'Choose your side quest.', short: 'City side quests', stay: 'Berjaya Times Square', theme: 'city', items: [
    { time: 'Daytime', title: 'Pavilion shopping mall', note: 'Walk over from the hotel.', kind: 'Explore' },
    { time: 'Lunch', title: 'Ippudo / Fei Fei Crab', note: 'Choose a lunch stop at Pavilion.', kind: 'Food' },
    { time: 'After lunch', title: 'Lot 10 · Don Don Donki', note: 'Time for a browse.', kind: 'Explore' },
    { time: 'Pick a game', title: 'Bonus round at Berjaya Times Square', note: 'Options, rather than three scheduled activities.', kind: 'Choose', options: ['B3 · Go Kart · RM49 / 10 minutes', 'L7 · Laser Battle · approx. $10 per person on Klook', 'Hologate VR · approx. $14 on Klook'] },
    { time: 'Dinner', title: 'Tea Garden', note: 'At Berjaya Times Square.', kind: 'Food' }
  ] },
  { date: '29 Nov', weekday: 'Sunday', place: 'Kuala Lumpur → Johor Bahru', title: 'Next stop: brick paradise.', short: 'To Legoland', stay: 'Legoland Hotel', theme: 'castle', items: [
    { time: '13:45', title: 'Kuala Lumpur → Johor Bahru', note: 'Train back to JB.', kind: 'Train' },
    { time: '17:55', title: 'Arrive in Johor Bahru', note: 'Head to Legoland Hotel and check in.', kind: 'Arrival' }
  ] },
  { date: '30 Nov', weekday: 'Monday', place: 'Johor Bahru', title: 'An open-world kind of day.', short: 'Free to build', stay: 'Legoland Hotel', theme: 'castle', items: [] },
  { date: '01 Dec', weekday: 'Tuesday', place: 'Johor Bahru', title: 'Make room for a little magic.', short: 'Free to build', stay: 'Legoland Hotel', theme: 'castle', items: [] },
  { date: '02 Dec', weekday: 'Wednesday', place: 'Johor Bahru', title: 'Your adventure goes here.', short: 'Free to build', stay: 'Legoland Hotel', theme: 'castle', items: [] },
  { date: '03 Dec', weekday: 'Thursday', place: 'Johor Bahru → Singapore', title: 'One last train. Home again.', short: 'Homeward bound', stay: 'Home · Singapore', theme: 'rail', items: [
    { time: '19:00', title: 'Johor Bahru → Singapore', note: 'Shuttle Tebrau train home.', kind: 'Train' },
    { time: '19:05', title: 'Arrive in Singapore', note: 'Home with a suitcase full of memories.', kind: 'Arrival' }
  ] }
];
