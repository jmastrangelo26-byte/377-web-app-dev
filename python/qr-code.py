import qrcode
from icalendar import Calendar, Event
import datetime

qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H, # High error correction for better compatibility
    box_size=10,
    border=4,
)

cal = Calendar()
event = Event()
event.add('summary', "Barstow Village")
# event.add('dtstart', 1/1/1)
# event.add('dtend', 1/1/1)
# event.add('location', "Barstool Village Conference Room A")

cal.add_component(event)
ical_string = cal.to_ical().decode('utf-8')

qr.add_data(ical_string)
qr.make(fit=True)

img = qr.make_image(fill_color="black", back_color="white")
img.save("event.png")

# Define the filename and save the image
