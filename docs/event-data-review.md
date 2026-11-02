# Event data for team review

Prepared for the NHWZ team (PRD v1.1 FR06; repository README "Event data and demonstration fixtures").
Please confirm or correct the records below and decide on section 3.

**Sources:** the printed 2026 programme (`docs/reference/programme-2026.png`) and the NHWZ Figma prototype,
which supplies the demonstration descriptions, Google Maps links, the PubQuiz registration form and the Walking
Tour cancellation for e01–e08. All records are historical (13–17 April 2026) demonstration data, not a confirmed
future programme.

## 1. What the app loads now: the historical acceptance dataset (8 events)

The app uses exactly the eight occurrences listed in the repository README, so acceptance checks AC01 and AC02
give the documented results (Monday: 5 unfiltered, 4 English, e04 for German). Thursday is intentionally empty in
this subset. Every value was checked against the programme image; differences are listed in section 2.

| ID | Time | Title | Venue | Campus | Category | Language | Status | To confirm |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| e01 | 10:00–12:00 | Computer Maintenance and Repair | UZH Irchel Tent | UZH Irchel | Workshop | EN | Scheduled | – |
| e02 | 12:00–13:00 | Foodsave Lunch | UZH Irchel Tent | UZH Irchel | Food | EN | Scheduled | – |
| e03 | 13:00–15:00 | Making the Switch to Linux | UZH Irchel Tent | UZH Irchel | Workshop | EN | Scheduled | – |
| e04 | 14:00–15:30 | Walking Tour on ETH Zentrum Campus | ETH Polyterrasse | ETH Zentrum | Tour | DE & EN | **Cancelled** | – |
| e05 | 19:30–22:00 | Sustainable PubQuiz | ETH Zentrum, bQm Bar | ETH Zentrum | Game | EN | Scheduled | – |
| e06 | 10:00–13:00 | From Waste Plastic to 3D Printing | UZH Irchel Stübli | UZH Irchel | Workshop | EN | Scheduled | – |
| e07 | 15:00–16:30 | KEEP IT COOL Ausstellungsführung | UZH Irchel Tent, as printed | UZH Irchel | Exhibition | EN | Scheduled | confirmed venue (design marks it "to be confirmed") |
| e08 | 18:15–20:15 | Gender, Sustainability & Climate Change | ZHdK 5.K11 | ZHdK | Panel | EN | Scheduled | – |

## 2. Where the image and the design differ

- **e01 Computer Maintenance and Repair:** Image spells the title "Computer Maintenence and Repair"; the design uses "Maintenance".
- **e04 Walking Tour on ETH Zentrum Campus:** Cancellation comes from the design annotation ("actual e04 is cancelled"); the printed programme does not show it.
- **e08 Gender, Sustainability & Climate Change:** Fixture room "5.K11" comes from the design; the image gives only "ZHdK" and lists 5.K11 for Biodiversitätsspiele Nachmittag.
- **e07 KEEP IT COOL Ausstellungsführung:** the image prints "UZH Irchel Tent"; as the README requires, the venue
  stays unresolved (no address or map link) until the team confirms it.

These follow the README rule not to replace fixture values silently with conflicting source information.

## 3. Optional: the rest of the programme (41 more events, not loaded)

The full programme was also transcribed into `docs/reference/programme-2026-transcription.json` (same format,
validated by the test suite). Loading it would fill every day, but it changes the AC01 results (Monday would have
12 events) and full programme entry needs your explicit agreement. If you want it, reply "load the full programme"
and confirm or correct the rows below.

How these rows were filled in: title, day, time, venue and language are copied from the image; category is read
from the colour key; descriptions are left empty ("not published yet"); registration shows "No registration
needed" because the programme says "free & open to all"; Google Maps links are given only where an address is
known (UZH Irchel, ETH Polyterrasse/bQm, ZHdK Toni-Areal, ZKSD Hardstrasse 235); venues outside the six campus
options are filed under "Other".

### Monday 13 April (7)

| ID | Time | Title | Venue | Campus | Category | Language | Status | To confirm |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| e09 | 12:00–13:00 | ETH Sustainability Open Office | ETH Zentrum | ETH Zentrum | Info event | DE & EN | Scheduled | description; room or meeting point |
| e10 | 13:00–14:00 | Behind the Scenes: Info-Event PHZH | PHZH Lounge-F-Nord | PHZH | Info event | DE & EN | Scheduled | description; address |
| e12 | 15:00–18:00 | Climate Fresk Workshop | PHZH LAA-K020 | PHZH | Workshop | EN | Scheduled | description; address |
| e11 | 15:00–18:00 | Zirkulär Handeln mit Zwiebeln | UZH Irchel Strebergärtli | UZH Irchel | Workshop | DE & EN | Scheduled | description; building-level location (campus address used) |
| e13 | 16:00–17:30 | Why We Will Fail the SDGs | PHZH LAA-L021 | PHZH | Panel | EN | Scheduled | description; address |
| e14 | 18:00–21:00 | ArborMundi Changemaker Workshop | PHZH LAA-K021 | PHZH | Workshop | DE & EN | Scheduled | description; address |
| e15 | 18:30–21:30 | Living Library and Flying Dinner | UZH Irchel Tent | UZH Irchel | Panel | EN | Scheduled | description |

### Tuesday 14 April (10)

| ID | Time | Title | Venue | Campus | Category | Language | Status | To confirm |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| e16 | 08:00–14:00 | Walking Days | ETH Polyterrasse | ETH Zentrum | Tour | EN | Scheduled | description |
| e17 | 09:00–21:00 | ZHAW Sustainability Day | ZHAW Winterthur | ZHAW | Panel | DE & EN | Scheduled | description; building and address |
| e18 | 09:30–11:00 | Workshop Grand Crochet & Fingerknit | ZKSD, Hardstrasse 235 | Other | Workshop | EN | Scheduled | description; postcode; campus (mapped to Other) |
| e19 | 12:00–13:30 | Foodsave Lunch | UZH Irchel Tent | UZH Irchel | Food | EN | Scheduled | description |
| e20 | 13:00–15:00 | Create or Collapse?: Mini Game Rounds | UZH Irchel Tent | UZH Irchel | Game | EN | Scheduled | description |
| e21 | 16:30–21:00 | Clothes Swap with Upcycling Station | UZH Irchel Tent | UZH Irchel | Workshop | EN | Scheduled | description |
| e23 | 17:00–18:00 | Auf den Spuren des Bibers | From Tramstop Tüffenwies | Other | Tour | DE | Scheduled | description; exact meeting point |
| e22 | 17:00–18:00 | Too Much is Not Enough? Tech Culture | UZH Irchel Tent | UZH Irchel | Panel | EN | Scheduled | description |
| e24 | 18:00–20:00 | Create or Collapse?: Game Playtest | ZHAW ZL O5.16 | ZHAW | Game | EN | Scheduled | description; address |
| e25 | 20:00–22:00 | Velokino: The Cost of Growth | UZH Irchel Tent | UZH Irchel | Music & Film | EN | Scheduled | description |

### Wednesday 15 April (8)

| ID | Time | Title | Venue | Campus | Category | Language | Status | To confirm |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| e26 | 11:00–14:00 | Sustainable Campus with Citizen Science | UZH Irchel Stübli | UZH Irchel | Panel | EN | Scheduled | description |
| e27 | 12:00–13:30 | Foodsave Lunch | UZH Irchel Tent | UZH Irchel | Food | EN | Scheduled | description |
| e28 | 13:00–14:00 | Biodiversity in Irchel Park | UZH Science Pavilion | UZH Irchel | Tour | DE & EN | Scheduled | description; address; campus (assumed Irchel from the event title) |
| e29 | 13:00–17:00 | Jät Jam & Fundland live | UZH Irchel Strebergärtli | UZH Irchel | Exhibition | DE & EN | Scheduled | description; building-level location (campus address used) |
| e31 | 17:30–22:00 | Foodsave Kitchen Challenge | Das Provisorium | Other | Food | EN | Scheduled | description; address |
| e30 | 17:30–21:00 | Naturally Vegan | UZH KOL-K-Küche | Other | Food | EN | Scheduled | description; address; campus (UZH Zentrum is not a filter option; mapped to Other) |
| e32 | 18:00–19:30 | Sustainable Travel Adventures | UZH Irchel Tent | UZH Irchel | Panel | EN | Scheduled | description |
| e33 | 20:00–22:00 | Velokino: Weit um die Welt | UZH Irchel Tent | UZH Irchel | Music & Film | DE & EN | Scheduled | description |

### Thursday 16 April (9)

| ID | Time | Title | Venue | Campus | Category | Language | Status | To confirm |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| e34 | 08:00–14:00 | Walking Days | ETH Zentrum | ETH Zentrum | Tour | EN | Scheduled | description; room or meeting point |
| e35 | 11:00–17:00 | Sustainable Startup Day | UZH Zentrum Lichthof | Other | Exhibition | EN | Scheduled | description; address; campus (UZH Zentrum is not a filter option; mapped to Other) |
| e36 | 12:00–13:30 | Foodsave Lunch | UZH Irchel Tent | UZH Irchel | Food | EN | Scheduled | description |
| e37 | 13:00–16:00 | Biodiversity Action Day at Irchel Campus | UZH Irchel | UZH Irchel | Workshop | DE & EN | Scheduled | description; meeting point on campus |
| e38 | 16:00–17:30 | Transdisciplinary Methodology | UZH Irchel Tent | UZH Irchel | Panel | EN | Scheduled | description |
| e39 | 17:00–19:00 | Storytelling Event | ETH Student Project House | ETH Zentrum | Panel | EN | Scheduled | description; address; campus (assumed ETH Zentrum) |
| e40 | 18:00–20:00 | Stormy Future: AI-based Weather Forecasts | UZH Irchel Tent | UZH Irchel | Panel | EN | Scheduled | description |
| e41 | 18:30–21:00 | A Planet for the 99% | UZH Zentrum KOL-F-101 | Other | Panel | EN | Scheduled | description; address; campus (UZH Zentrum is not a filter option; mapped to Other) |
| e42 | 20:15–22:00 | Let's Jam Together | UZH Irchel Tent | UZH Irchel | Music & Film | EN | Scheduled | description |

### Friday 17 April (7)

| ID | Time | Title | Venue | Campus | Category | Language | Status | To confirm |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| e43 | 10:00–11:00 | Behind the Scenes: NHWZ Info-Event | ZHdK Toni-Areal | ZHdK | Info event | DE & EN | Scheduled | description |
| e44 | 12:00–13:00 | Foodsave Lunch | UZH Irchel Tent | UZH Irchel | Food | EN | Scheduled | description |
| e45 | 13:30–16:00 | Plastic Upcycling Workshop | UZH Irchel Tent | UZH Irchel | Workshop | EN | Scheduled | description |
| e46 | 13:30–17:30 | Repair Day at AMIV Bastli | UZH Irchel Tent | UZH Irchel | Workshop | EN | Scheduled | description |
| e47 | 14:00–17:30 | Biodiversitätsspiele Nachmittag | ZHdK Seminarraum 5.K11 | ZHdK | Game | DE | Scheduled | description |
| e48 | 14:15–17:30 | Excursion to the Wastewater Plant | Werdhölzli Plant | Other | Tour | EN | Scheduled | description; address |
| e49 | 19:00–23:00 | Closing Party | UZH Irchel Bar | UZH Irchel | Music & Film | EN | Scheduled | description; building-level location (campus address used) |

### Left out: no end time in the programme

The app needs a start and an end time for every event.

| Day | Printed start | Title | Venue | Language | Category |
| --- | --- | --- | --- | --- | --- |
| Tuesday 14 April | 10:00 | Kleidertausch ZhdK | ZHdK Toni-Areal | DE & EN | Workshop |
| Wednesday 15 April | 10:00 | Kleidertausch (Wednesday) | ZHdK Toni-Areal | DE & EN | Workshop |
| Thursday 16 April | 09:30 | Slow Fashion Basics | ZKSD Hardstrasse 235 | EN | Workshop |
| Thursday 16 April | 13:00 | Sustainable Impact vs Effort: You Choose | UZH Irchel Tent | EN | Game |

## How to send corrections

Reply with the event ID and the corrected field (for example "e12: end time 17:30"), or edit
`data/events.json` directly; see `README.md` for the field format.
