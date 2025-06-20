Hotel Room Reservation System — Functional Requirements
📘 Page 1: Homepage – Room Search Form
Display the following:

Hotel images and room photos

Hotel name and address

Hotel star rating (e.g., \*\*\*\*)

Interactive room search form:

Number of adults (input)

Number of kids (input)

Number of rooms (input)

Check-in date (calendar picker)

Check-out date (calendar picker)

Find Rooms button

📘 Page 2: Rooms and Rates Listing
Trip Summary Header (dynamic):

Check-in date - Check-out date

Rooms: 1

Adults: 2

Kids: 0

Room Listings (Repeat for each room type):

Room title (e.g., “Classic: 1 king bed (24 m²)”)

Price (e.g., “Price: 150 €”)

Room image

"Book Now" button

Optional amenities (clickable toggle):

Free internet access (public areas)

Non-smoking facility

Fitness center

Laundry

Lounge/bar

24h front desk

In-room safe

Business center

📘 Page 3: Booking Confirmation Form
Left Section – Form Inputs:

Room 1 Guest Name

First Name

Last Name

Check-in date (auto-filled)

Check-out date (auto-filled)

Email Address (for confirmation)

Mobile Phone Number (with country code)

Billing Address:

Country

Street

City

Postal Code

Secure Payment Details:

First Name on Card

Last Name on Card

Credit Card Number

Card Type (Dropdown):

American Express

MasterCard

Visa

Card Expiration: Month / Year

Important Note:
This rate is non-refundable and cannot be changed or canceled.

Right Section – Booking Summary:

Room 1 Guest: 2 Adults

Average Nightly Rate: €\_\_\_

Total Charge (Tax Included): €\_\_\_

✅ Final Action
Button: “Confirm Your Booking”

After confirmation: User receives an email with booking confirmation and reservation number.

📞 Support
Display assistance contact number:
Need assistance? Tel. ****\_\_\_\_****



Here are some additional requirements specific to backend:
Creat a room reservation program of a hotel with a realtime update of room inventory in order to have a dynamic pricing. Incorporation of payment modul is required. 
Programming language : backend C#, frontend in Vue.js, mobile app flutter. The backend is common for the frontend for the web and the mobile app. The backend should be seperated in Controller - Services - Repository.

its a simulation project which shall work locally on my machine.
the data base should be SQL; framwork should be followed .

The dynamic pricing would mean change of room rate in connection of rooms availability of the date chosen.
For example, we put this hotels with 50 rooms and a rack rate of €100. While making the reservation if the occupancy is below 30% we will automatically apply 20% discount on the rake rate €80 (100-20)of the room, once above 30% till 70% of occupancy the rate of €100 (full rate) and once the occupancy of the particular date is 71% and more we add additional 20% on rate so the room will be booked at the rate of €120 (100+20). This is what the dynamic pricing is. Very important to have a permanent inventory of rooms available in the hotel.
Once the client has selected the dates on the page of the reservation dates and number of rooms with proposed room rate, he will be invited to fill up confirm your booking after completing this he should be redirected to the payment.

Once payment made come back to the trip summary page and must receive an email confirmation with automated reservation number.