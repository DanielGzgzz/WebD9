import time
from playwright.sync_api import sync_playwright

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="videos/",
            record_video_size={"width": 1280, "height": 720}
        )
        page = context.new_page()

        # Navigate to local server
        page.goto("http://localhost:8000")

        # Start game
        page.click("#startBtn")
        time.sleep(1)

        # Take initial screenshot showing instructions and horizon
        page.screenshot(path="screenshots/initial.png")

        # Toggle instructions using 'H' key
        page.keyboard.press("h")
        time.sleep(1)
        page.screenshot(path="screenshots/hidden_instructions_h.png")

        # Toggle instructions back using 'H' key
        page.keyboard.press("h")
        time.sleep(1)

        # Click the hide button
        page.click("text=Hide/Show")
        time.sleep(1)
        page.screenshot(path="screenshots/hidden_instructions_button.png")

        # Drive the D9 to see tanks
        page.keyboard.down("ArrowUp")
        time.sleep(5)
        page.keyboard.up("ArrowUp")

        page.screenshot(path="screenshots/after_driving.png")

        context.close()
        browser.close()

if __name__ == "__main__":
    import os
    os.makedirs("videos", exist_ok=True)
    os.makedirs("screenshots", exist_ok=True)
    verify()
