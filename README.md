# Developer notes

1. This project was worked on over a period of several weeks at my own free time. 
2. The point of the project was to showcase an idea, not optimisation.
3. As the only developer for this application, I paid no attention to scalability nor readability.

# Project information

This application, along with several other programs, was used to showcase a Gamified User-friendly Automated Rubbish Disposing Instrument *Amazing Name* (GUARDIAN) system. The project was supported by Overflow SIG at Ngee Ann Polytechnic. The project team consists of myself and two other members.

GUARDIAN is a system that aims to educate the general public on recycling through gamification (which is what this web application is). It also has a physical component, a trash can, which uses machine learning to sort the various types of discarded items by material. At the time of presentation, it is able to correctly sort between metal and plastic. 

The flow of the system is simple, 
1. User inputs an item into the system.
2. ML algorithm detects the items, senses the material, and sends the data to Firebase's Firestore.
3. Web application detects the change in Firebase's Firestore, promots the user to guess the material.
4. Web application then prompts the user to select a difficulty for a quiz regarding that material.
5. Web application rewards the user with points accordingly (points is useless in our system, but it is used to showcase its potential).
6. Robot sorts the item accordingly.

The theme of the competition is Smart City, which consists of 3 smaller sub-theme - Smart Education (Web Application), Smart WorkForce (Automatic Sorting), and Smart Governance (aids the government to reduce effects of climate change).




# GuardianThreePointO

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.5.
