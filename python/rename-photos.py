import os 

folder = '/Users/jamesmastrangelo/Documents/WebAppDev/377-web-app-dev/python/photos'

prefix = 'ourAdministrators'
file_type = 'jpg'
count = 1

for filename in os.listdir(folder):
    extension = filename.split('.')[-1]
    
    if extension == file_type:
        new_filename = prefix + '-' + str(count) + file_type
        print('Old: ' + filename)
        print('New: ' + new_filename)
       
        source = folder + '/' + filename
        destination = folder + '/' + prefix + '-' + str(count) + '.jpg'
        
        os.rename(source, destination)
    
    count += 1
