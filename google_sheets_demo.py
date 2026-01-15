import gspread
from oauth2client.service_account import ServiceAccountCredentials

# 1. Define the scope (what we can do)
scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]

# 2. Authenticate using your JSON key
# Ensure 'service_account.json' is in the same directory or provide the full path
try:
    # Updated path based on user input
    creds = ServiceAccountCredentials.from_json_keyfile_name(r"D:\CACSwebupra\database\service_account.json.json", scope)
    client = gspread.authorize(creds)
    
    print("Successfully authorized with Google Sheets API.")

    # 3. Open the Sheet
    # Make sure your actual sheet is named EXACTLY "My Website Data"
    sheet_name = "My Website Data"
    try:
        sheet = client.open(sheet_name).sheet1
        print(f"Successfully opened sheet: {sheet_name}")

        # --- HOW TO USE IT ---

        # READ: Get all data as a list of dictionaries (like a real DB)
        # Example: [{'Name': 'Rahul', 'Age': '19'}, {'Name': 'Amit', 'Age': '21'}]
        data = sheet.get_all_records()
        print("Current Data:")
        print(data)

        # WRITE: Add a new row
        # Example data - you might want to customize this
        new_user = ["Vikas", "vikas@gmail.com", "Buyer"]
        sheet.append_row(new_user)
        print(f"Added new user: {new_user}")

        # SEARCH: Find a specific cell (e.g., find row where Email is 'vikas@gmail.com')
        search_email = "vikas@gmail.com"
        try:
            cell = sheet.find(search_email)
            print(f"Found {search_email} at Row: {cell.row}, Col: {cell.col}")
            
            # UPDATE: Change a value (e.g., update the Role column if it exists, or just a specific cell)
            # Updating the cell next to the email (assuming structure Name, Email, Role)
            # cell.row, cell.col + 1 would be the Role column if Email is col 2
            # For demonstration as per request: update Row 2, Column 3
            # Be careful with hardcoded indices in real apps
            sheet.update_cell(2, 3, "Seller")
            print("Updated cell (2, 3) to 'Seller'")
            
        except gspread.exceptions.CellNotFound:
             print(f"Email {search_email} not found.")

    except gspread.exceptions.SpreadsheetNotFound:
        print(f"Error: Spreadsheet '{sheet_name}' not found. Please make sure the sheet exists and is shared with the service account email.")

except FileNotFoundError:
    print("Error: 'service_account.json' file not found. Please place your Google Cloud service account JSON key in this directory.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
