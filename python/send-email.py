email_user_name = 'jmastrangelo26@hanoverstudents.org'
email_app_password = input('Enter your password: ')

import smtplib

from email.message import EmailMessage

msg = EmailMessage()
msg.set_content('This is a test message')
msg['Subject'] = 'TEST MESSAGE #1'
msg['From'] = email_user_name
msg['To'] = 'jmastrangelo54@icloud.com'

with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
    print('Authenticating...')
    server.login(email_user_name, email_app_password)
    print('Sending...')
    server.send_message(msg)
    server.quit()
    print('Message sent!')