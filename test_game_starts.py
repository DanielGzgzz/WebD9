from playwright.sync_api import sync_playwright

def test_game_starts():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        errors = []
        page.on("pageerror", lambda err: errors.append(err.message))
        page.on("console", lambda msg: print(f"Console: {msg.text}"))

        page.goto("http://localhost:8000")
        page.wait_for_selector("#mainMenu", state="visible")
        print("Menu is visible.")

        page.click("#startBtn")
        page.wait_for_timeout(1000)

        is_playing = page.evaluate('gameState === "PLAYING"')
        print("Game is running:", is_playing)

        page.wait_for_timeout(1000)

        if errors:
            print("Console errors found:", errors)
        else:
            print("No console errors.")

        page.screenshot(path="recovered_test.png")
        print("Screenshot saved to recovered_test.png")
        browser.close()

test_game_starts()
