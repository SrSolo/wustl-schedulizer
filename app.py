import re
import PyPDF2
from icalendar import Calendar, Event
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename

app = Flask(__name__)

ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_schedule_info(pdf_data):
    schedule = []
    pdf_reader = PyPDF2.PdfFileReader(pdf_data)

    # Regular expression pattern to match the schedule format: "DAYS TIME-TIME"
    pattern = r"\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun)(?:-(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun))*\s+(\d{1,2}:\d{2}[ap]m-\d{1,2}:\d{2}[ap]m)\b"

    for page_number in range(pdf_reader.numPages):
        page = pdf_reader.getPage(page_number)
        text = page.extractText()

        # Find all day and time matches
        matches = re.findall(pattern, text)

        for match in matches:
            day_time = match[0]
            time_range = match[1].split('-')

            schedule.append((day_time, time_range[0], time_range[1]))

    return schedule

def create_ical_file(schedule):
    cal = Calendar()

    for day_of_week, start_time, end_time in schedule:
        event = Event()
        event.add('summary', f'Event ({day_of_week})')
        event.add('dtstart', f'20230723T{start_time.replace(":", "")}')
        event.add('dtend', f'20230723T{end_time.replace(":", "")}')
        cal.add_component(event)

    return cal.to_ical()

@app.route('/upload', methods=['POST'])
def upload_file():
    # Check if the POST request has the file part
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    # If the user does not select a file, the browser may submit an empty part without filename
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file and allowed_file(file.filename):
        # Process the file in memory without saving to disk
        pdf_data = file.read()

        extracted_schedule = extract_schedule_info(pdf_data)
        ical_data = create_ical_file(extracted_schedule)

        # Respond with the generated iCal data
        return ical_data, 200, {'Content-Type': 'text/calendar'}
    else:
        return jsonify({'error': 'Invalid file format'})

if __name__ == '__main__':
    app.run(debug=True)
