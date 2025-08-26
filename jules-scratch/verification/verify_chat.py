from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Register a new user to ensure a clean state
        page.goto("http://localhost:3000/api/auth/register")
        page.get_by_placeholder("Username").fill("chattester")
        page.get_by_placeholder("Password").fill("password123")
        page.get_by_role("button", name="Register").click()

        # Login
        expect(page).to_have_url("http://localhost:3000/api/auth/login")
        page.get_by_placeholder("Username").fill("chattester")
        page.get_by_placeholder("Password").fill("password123")
        page.get_by_role("button", name="Login").click()

        # Check that we are on the homepage
        expect(page).to_have_url("http://localhost:3000/")

        # Check that the user's own name is in the user list
        user_list = page.locator(".chat-list")
        expect(user_list).to_contain_text("chattester")

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/chat_page.png")

        browser.close()

run()
