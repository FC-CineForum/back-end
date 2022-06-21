from Classification import Classification

class Presentation():

    def __init__(self, contents):
        n = len(contents)
        release_date = contents[1] if contents[0].text[0:2] == 'TV' else contents[0]
        self.release_date = convert_release_date(release_date.text)

        classification = contents[n-2].text if n > 2 else ''
        self.classification = convert_classification(classification)

        duration = contents[n-1].text
        self.duration = convert_duration(duration)

def convert_release_date(release_date_format):
    n = len(release_date_format)
    release_date = release_date_format[0:4]
    if n == 5:
        release_date = release_date_format[0:4]
    elif n > 18:
        release_date = release_date_format[n-4:n]
    return int(release_date)

def convert_classification(classification_format):
    n = len(classification_format)
    classification = classification_format[0:int(n/2)]
    try:
        return Classification(classification).name
    except:
        print('\n**Agrega '+classification+' a las clasificaciones**\n')

def convert_duration(duration_format):
    hour_index = duration_format.find('h')
    minute_index = duration_format.find('m')
    hours = 0
    if hour_index != -1:
        hours = int(duration_format[0:hour_index])
    minutes = 0
    if minute_index != -1:
        minutes = int(duration_format[minute_index-2:minute_index].strip())
    return hours*60 + minutes
