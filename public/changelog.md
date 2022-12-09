### 2.3.0 - Momentary Marid
#### October 8th, 2022
- Added: Real-time calendar advancement
- Fixed: Modulo by 0 when an interval is somehow set to 0
- Fixed: Invalid category IDs upon Calendar import/export

### 2.2.17 - Careful Couatl
#### September 29th, 2022
- Fixed: Error trying to log certain requests

### 2.2.16 - Catchable Couatl
#### September 28th, 2022
- Fixed: Active ability to log errors to a Discord channel - Don't try to use the word "Discord" in a webhook name

### 2.2.15 - Certain Couatl
#### September 24th, 2022
- Fixed issue with multiple Intercalary Leap days causing calendars to not load properly 

### 2.2.14 - Continual Couatl
#### September 21st, 2022
- Fixed: Messaging/placeholder regarding embedding as a premium feature 
- Updated: Dependencies.

### 2.2.13 - Confused Couatl
#### July 7th, 2022
- Fixed: Discord interactions not working due to int -> string cast during response
- Updated: A few dependencies
- Updated: Adjustment to some admin tools

### 2.2.12 - Commercial Couatl
#### July 6th, 2022
- Fixed rendering issue on calendars when changing certain calendar properties
- Fixed adjusting month lengths would cause the current date to slide
- Fixed Discord calendar renderer being off by one when the year started with an intercalary month
 
### 2.2.11 - Confident Couatl
#### June 1st, 2022
- Fixed date-based events to not cause calendar to look simulate past years if it has a duration
- Date-based events now supports insanely long durations (still HEAVILY discouraged)
- Backend updates to be able to verify people's emails remotely 

### 2.2.10 - Concerned Couatl
#### May 22nd, 2022
- Fixed critical issue with event-based-events that could cause them to sometimes contain incorrect event
- Improved handling of said event-based-events when events get removed

### 2.2.9 - Courteous Couatl
#### May 18th, 2022
- Fixed rendering issue which was caused by advancing the current year
- Fixed issue preventing the calendar from scrolling to the current date when first loaded
- Fixed issue which could cause event-based-events to cause infinite recursion
- Removed event-testing feature until we can solve a more deeply rooted issue

### 2.2.8 - Contextual Couatl
#### April 12th, 2022
- Replace Sharp library with Filament for rewritten internal admin panel
- Laid the basis for user API token management
- App Feature Flags (For disabling things in development)
- Upgrade some dependencies

### 2.2.7 - Cackling Couatl
#### April 1st, 2022
- Enabled enhanced... wait, what?

### 2.2.6 - Contemporary Couatl
#### March 23rd, 2022
* Added: `/fc create event` - Create one-time events from Discord!
* Added: `/fc overview` - **Experimental** "show me all of it" command, intended to (one day) include moons, weather, etc. Currently just includes one-time events (e.g. "Date is exactly" condition)
* Added: Admin action to manually verify user email addresses
* Reworked: Error pages into new theme
* Reworked: Discord account connection process to fit into into new theme
* Reworked: Various small UI bits to reduce the number of page reloads throughout the app
* Reworked: Moved existing, undocumented API to /api/v1, in preparation for public API availability
* Upgraded: Alpine.js to v3
* Upgraded: Laravel to v9
* Removed: A bunch of old cruft pages and code that was unnecessary

### 2.2.5 - Cozy Couatl
#### February 27th, 2022
- Updated: Reworked the calendar list into our new visual style

### 2.2.4 - Charismatic Couatl
#### February 25th, 2022
- Added official support for spanning on the Microsoft Surface Duo and Surface Duo 2 (Improvements will come later ... for now I just wanted the gap to not cover things with the sidebar open)
- Updated landing page and launch of https://fantasy-calendar.com/ separate from the primary app
- Rewrote Discord feature page into using the new style/theming system
- Fixed season colors looking odd in minimalistic layout
- Fixed hex color generator sometimes generating invalid colors
- Fixed `'on' is not defined` error on login page in specific scenarios

### 2.2.3 - Captivating Couatl
#### February 16th, 2022
- Beautified the login and registration pages
- Improved the readability and looks of the T&C and Privacy Policy pages
- Added beautified footer to all reworked pages

### 2.2.2 - Prismatic Couatl
#### February 13th, 2022
- App theme rebuilt from the ground up
- Improved dark theme event coloration
- Made season colors vivid
- Added season colors to minimalistic layout
- General edit input improvements
- Fixed images overflowing event window

### 2.2.1 - Concise Couatl
#### February 11th, 2022
- Updated - Fully reworked Profile, Pricing and Billing pages
- Added - Support for the Stripe billing portal

### 2.2.0 - Compatible Couatl
#### January 29th, 2022 
* Added - Calendar Embedding!
* Fixed - Fixed erroneously taking starting eras into account when calculating epoch
* Fixed - Fixed starting eras that were previously ending and restarting still maintaining their ending and starting status even after becoming starting eras
* Fixed - Era year sometimes being off by one

### 2.1.6 - Nitpicking Djinn
#### January 9th, 2022 
* Fixed - Fixed some linked calendars not syncing properly
* Fixed - Fixed month number not being accurate when with one-month layout

### 2.1.5 - Festive Djinn
#### December 17th, 2021 
* Fixed - Fixed month header number count being off
* Fixed - Fixed limited repetition events acting wonky when show only current month was active
* Fixed - Fixed show only current month breaking first weekday flow

### 2.1.4 - Investigative Djinn
#### November 25th, 2021
* Added - Warning under seasons when a custom location with custom sunrise and sunset times is active 
* Fixed - Locking a custom location's sunrise and sunset times would cause it to not be saved correctly
* Fixed - Calendars with only intercalary months would fail to build

### 2.1.3 - Curious Djinn
#### November 16th, 2021
* Tweaked - Lowered the sensitivity of the auto-scroll that would scroll to the current date
* Fixed - Some event condition presets resulting in broken conditions
* Fixed - An intercalary month at the start of the year would break the entire year's weekday flow
* Fixed - Leap months causing the following months to have incorrect IDs which would break some events

### 2.1.2 - Scrutinizing Djinn
#### November 7th, 2021
* Tweaked - Slightly improved leap day calculation speed
* Tweaked - General backend upgrades and improvements
* Tweaked - Added additional error checking surrounding the clock durations
* Tweaked - Made length based seasons default on new calendars
* Fixed - Users who were added as players to calendars were not able to create events
* Fixed - Leap day calculation on very specific interval setups
* Fixed - Date not updating properly when changing leap day intervals or deleting leap days
* Fixed - Fixed season type mapping would sometimes not work when adding multiple seasons in a row
* Fixed - Fixed ends year prematurely option on eras looking disabled after switching season type

### 2.1.1 - Tranquil Djinn
#### October 19th, 2021
* Fixed - Discord Integration error caused by users not having set their discord avatar
* Fixed - Calendar presets sometimes not loading correctly
* Fixed - Year header error appearing if eras were present on calendar load
* Fixed - Leap day intervals not sorting correctly, causing avg. year length and month length to be off
* Fixed - Week day number in month being incorrectly set, causing events that were using it to not appear
* Fixed - Superwide calendars not scrolling horizontally far enough

### 2.1.0 - Discordant Djinn
#### October 15th, 2021
* Added - Discord integration!
* Added - Event moon overrides - Change your moons with events, such as color, phase, phase name, and visibility! 
* Reworked - Year header no longer updates current era when scrolling - now based entirely on current date
* Reworked - Completely reworked the event editor and event viewer UI
* Tweaked - Renamed the "Create Calendar" button to "Save Calendar" to avoid confusion
* Tweaked - Location list now shows all preset locations, but disable them if requirements are not met
* Fixed - Linked child calendars sometimes not having the correct date & time, should now be accurate down to the minute
* Fixed - Day data previewer not working in certain browsers
* Fixed - Date dropdowns in date selectors (such as in events and eras) being incorrectly set up 
* Fixed - Vastly improved calendar accuracy - this fixes a lot of issues such as moon drifting and weekday weirdness over years  
* Fixed - Issues surrounding the overflow weekdays checkbox, as it would not disable when it should have
* Fixed - Season day flow should be more accurate - some calendars with crazy setups may still be inaccurate across years due to floating point errors (curse you javascript!)
* Fixed - Season colors sometimes not appearing in the right order
* Fixed - Leap day and leap month appearing on the wrong cycles on negative years or on calendars with year zero enabled
* Fixed - Issues with the Custom JSON loader when loading calendars exported from Fantasy-Calendar
* Fixed - Toggling between date-based and length-based season type would sometimes break custom locations
* Fixed - Improved accuracy of moon repetitions that are used in event conditions
* Fixed - Average year length and month lengths not being accurate
* Fixed - Copying the link to dates on calendars would sometimes not work
* Fixed - Rare issue with event-based-events that would cause a recursion error

### 2.0.20 - Typesetting Efreet
#### May 15, 2021
* Tweaked - Default era formatting tweaked to utilize era year instead of absolute year when era restarts the year count 
* Fixed - Date-based events not properly filling out their data when edited 
* Fixed - Browser print customization options are no longer disabled. Users can now select portrait or landscape, as well as page sizes and color options.

### 2.0.19 - Facepalming Efreet
#### May 10, 2021
* Fixed - Intercalary leap days would not properly set their month, causing all sorts of havoc 

### 2.0.18 - Attentive Efreet
#### May 9, 2021
* Fixed - "Calendar Unavailable" page now loads correctly
* Fixed - Generalized error page actually loads when appropriate 

### 2.0.17 - Calm Efreet
#### May 7, 2021
* Tweaked - Improved error pages (that we hope you won't see!)
* Fixed - Season type being visible even when automatic mapping was found
* Fixed - Issue where season boolean conditions would not show up correctly
* Fixed - Leap day fractional numbers not being accurate - you might have to double-check your season durations
* Fixed - Season colors causing errors on certain calendars

### 2.0.16 - Stressed Efreet
#### April 26, 2021
* Tweaked - Greatly improved database performance when loading certain pages to try and address recent downtime issues
* Tweaked - Intercalary leap days can now exist without changing the order of numbered days in a month, or display its own custom name above the day
* Fixed - Enabling *Custom year header formatting* on eras causing error
* Fixed - Weekday leap days not being ordered correcly on their months
* Fixed - Season type selection dropdown visible with more than 4 seasons
* Fixed - Moon names sometimes breaking on the advanced day data modal
* Fixed - Cycle type resetting for all cycles when re-ordering or deleting cycles
* Fixed - Calculation of leaping months with leap days on negative years

### 2.0.15 - Industrious Efreet
#### February 25, 2021
* Fixed - Calendar export being broken on some calendars

### 2.0.14 - Time-traveling Efreet
#### January 23, 2021
* Tweaked - Cycle condition dropdown now includes which cycle family the condition is point to
* Tweaked - Enable season day color will now generate a new set of colors and sequence them properly
* Fixed - Events landing on intercalary leap days that happen at the end of a month not appearing
* Fixed - Nesting normal event groups inside of number event groups caused events to appear when they shouldn't

### 2.0.13 - Squashing Efreet
#### January 18, 2021
* Tweaked - Added popup warn if more than 1 set of solstice events exist on event creation
* Tweaked - Creating random-type condition event will now randomize its seed
* Fixed - Date-specific events sometimes landing on the wrong date
* Fixed - Interpolate season sunrise and sunset times should also apply that time to locked location times
* Fixed - Duration-based season rounding, yet again
* Fixed - Advanced day data dialog, also yet again
* Fixed - Inverse month and year week number conditions

### 2.0.12 - Scrutinizing Efreet
#### January 6, 2021
* Fixed - Leap days and months being off by 1 year on negative years with year zero exists turned off
* Fixed - View advanced day data not opening and throwing error
* Fixed - Day dropdown not refreshing when new month was selected through the month dropdowns
* Fixed - Time-based solstice events sometimes being off by a few days

### 2.0.11 - Celebratory Efreet
#### December 31, 2020
* Tweaked - Exandrian Calendar preset is now correct, courtesy of [critical role stats](https://www.critrolestats.com/calendar-wm)
* Fixed - Season day sometimes being off by 1 or 2 days - we recommend you double check any events using season day
* Fixed - Event-based-events would sometimes not appear across years or months (with *Show Only Current Month* turned on)
* Fixed - Deleting events in view mode would sometimes cause error that would break calendars

### 2.0.10 - Sorting Efreet
#### December 19, 2020
* Fixed - Date based seasons not sorting correctly

### 2.0.9 - Forgetful Efreet
#### December 19, 2020
* Tweaked - Sorting speed of eras and seasons significantly improved
* Fixed - Season type resetting when editing seasons

### 2.0.8 - Sweating Efreet
#### December 16, 2020
* Fixed - Profile and subscription pages sometimes not loading
* Fixed - Testing intercalary-based events causing error
* Fixed - Equinox event sometimes not appearing when show only current month was enabled

### 2.0.7 - Familiar Efreet
#### December 13, 2020
* Added - Option to change your account's email address
* Added - Checkbox to base location sunrise and sunset to season's times
* Fixed - Commenting styling on dark theme
* Fixed - Season and weather being off on dated seasons with show only current month setting
* Fixed - Rounding error within the time-generation of seasons
* Fixed - Hidden moons staying visible to guest viewers

### 2.0.6 - Talkative Efreet
#### November 21, 2020
* Added - Ability to edit and delete event comments
* Added - Updating your email is now possible from your profile
* Fixed - Calendars with errors still being able to be saved
* Fixed - Leap days with interval of 0 now shows proper error
* Fixed - Some event presets would throw an error
* Fixed - Show month number displaying the wrong number
* Fixed - Week-in-year calculation being off, throwing off some event conditions
* Fixed - Hide time from guest viewers would not do anything
* Fixed - Cycle would error out when changing month interval and offset

### 2.0.5 - Uncorked Efreet
#### November 17, 2020
* Fixed - Default event category not being saved properly
* Fixed - Users not being able to comment on events

### 2.0.4 - Stylish Efreet
#### November 15, 2020
* Added - Preview era start date button to eras
* Added - Hidden event preview when styling events
* Added - Wind velocity in knots on daily weather
* Tweaked - Removed map preset seasons, added season type to seasons if matches not found
* Tweaked - Sidebar made smaller on higher resolution screens
* Tweaked - Backend performance optimizations
* Fixed - Copying locations would not respect custom season order
* Fixed - Cycle-based conditions not being evaluated properly
* Fixed - Users not being able to see their own hidden events on others' calendars
* Fixed - Event categories sometimes not being loaded correctly
* Fixed - Copied calendars breaking default event category
* Fixed - Deleting event condition group sometimes deleted the whole event condition container
* Fixed - Cycle error message caused by adding or removing months
* Fixed - Current time inputs visible in view mode when clock was disabled
* Fixed - One time events with durations not wrapping around to subsequent years
* Fixed - Events without conditions could sometimes prevent calendars from loading

### 2.0.3 - Insightful Efreet
#### November 13, 2020
* Tweaked - Detect and prevent deceitful, spammy account registrations

### 2.0.2 - Communicative Efreet
#### November 13, 2020
* Tweaked - Updated the edit event UI with a collapsed settings section to preserve space
* Tweaked - Hide event testing buttons if the event is an one time event
* Fixed - Event testing breaking saving of new events
* Fixed - Deleting months sometimes caused date to become invalid
* Fixed - Donjon calendar import
* Fixed - Interpolate season data button not working with date-based seasons

### 2.0.1 - Grandiose Efreet
#### November 11, 2020
* Tweaked - Updated the edit event UI with a collapsed settings section to preserve space
* Tweaked - Hide event testing buttons if the event is an one time event
* Fixed - Event testing breaking saving of new events
* Fixed - Deleting months sometimes caused date to become invalid
* Fixed - Donjon calendar import
* Fixed - Interpolate season data button not working with date-based seasons

### 2.0 - Royal Efreet
#### November 6, 2020

This update has a **lot** of changes. If anything confuses you, check out the [comprehensive helpdocs](https://helpdocs.fantasy-calendar.com/) for detailed information on each topic.

You can also click on the question marks that are found on the sidebar in the calendar, as well as inside some of the headers.

The entire UI has been overhauled with many alterations that come with the changes below.

##### NEW FEATURES
* **Mobile device support**
     * Fantasy-Calendar now supports mobile devices!
* **Dark theme**
     * You can enable this in your profile. Ahhh, comfy retinas.
* **Intercalary months**
     * These months have days like a normal month, but their weekdays do not adhere to the normal weekday flow.
* **Leap Days**
     * You can now have multiple leap days!
     * Leap days can also be intercalary, where it interrupts the month, inserts a day outside of the weekday flow, and then continues the month as if nothing happened.
     * A leap day can also add a customly named weekday to the month - useful for Roman-styled calens and ides calendars.
* **Seasons**
     * Completely overhauled seasons
     * You have a choice between static (dated) and dynamic (duration) based seasons.
     * Static date-based seasons are as they were in 1.0, attached to specific dates on specific months, and never changing
     * Dynamic duration-based seasons have a set length, like in our world. This means that your seasons can drift if the average year length and the season length don't match
* **Cycles**
     * You can now create zodiac years like in the Chinese calendar with the brand new cycle system
     * Cycles can be based on the year, era year, month in year, month count since the first year, day in month, day in year, epochs (days since first year)
* **Eras**
     * Eras work like A.D. and B.C. in the Gregorian calendar, where each era has a start date and lasts until a new era begins
     * You can set one era to be the "Beginning Era", meaning it's always active until a new era starts - like B.C., it was always before christ, until Christ came along
     * Eras can reset the year prematurely like in some dynastic calendar
     * The year count can also reset with the emergence of a new era - like if an emperor in your world died, and now it's "The 1st Year of the Empress" after his successor took the throne
* **Event conditions**
     * Events now support multi-conditional setups, where each event can be driven by any part of the calendar to be able to be shown
     * Parameters include year, month, day, epoch, week day, weeks, moons, cycles, eras, era year, seasons, seeded random chance, and event-based-conditions (event chaining!)
* **Event Categories**
     * Events can now have categories that you can use as presets when creating events
* **Layouts**
     * You can now display your calendar in four different ways. Styles include grid, wide, and minimalistic
* **Calendar linking**
     * You can now link calendars together - one parent calendar can influence other calendars in your world, making sure that all of them are in tandem
     * This is a powerful feature that ensures a 1 to 1 representation between vastly different calendars
     * **Note** -  this is a premium feature, read more on the [FAQ](https://fantasy-calendar.com/faq)

##### REWORKS
* **Clock**
     * Overhauled the clock and the sunrise-sundown system so that it can accomodate crazy times
     * Added offset hours which simply rotate the numbers around the clock face
     * Added crowding - you can now remove every nth number on the face of the clock if you have too many hours in a day
* **Weeks**
     * The week system has changed to support the changes in the month system
     * There is now a global week, which acts as the standard week in the calendar
* **Months**
     * Months can now leap! You can control this through the interval in the month itself
     * Months can now also have an overriding week, for use in roman-styled calendars
* **Moons**
     * Added dynamic moon granularity, instead the static 16 sprites in 1.0. We now have support up to 40 unique moon sprites
     * Moons can now have a custom phase count, read up on the [fantasy calendar helpdocs](https://helpdocs.fantasy-calendar.com/topic/moons/) to understand how that works
     * Now you can also hide individual moons from your viewers
* **Weather Generation**
     * Completely overhauled the weather generation system
     * It support offseting the weather from the season so that the coldest day doesn't always fall on the winter solstice, for example
* **Locations**
     * The location system has been reworked, and each location can now have their own sunrise and sunset times per season, and timezone adjustments when active
     * Weather is also directly tied to the location now, with precipitation chance and percipitation intensity becoming two different parameters
* **Events**
     * Events now support full markdown editing, and in-calendar display settings such as color and text styles
* **Settings**
     * Multiple settings have been brought up to speed with the rest of the calendar systems


### 1.6a
#### May 1, 2019
* Fixed - Some users not being able to log in.

### 1.6
#### April 30, 2019
* Added - An easy way to share your calendar with anyone, the field is located above the 'to view' or the 'to edit' button.

### 1.5d
#### January 19, 2019
* Fixed - Bug that caused no-print events to be printed anyway.

### 1.5c
#### January 12, 2019
* Tweaked - Moon color background implementation has been tweaked, it will hopefully work better on Mac and Linux now.

### 1.5b
#### January 11, 2019
* Fixed - If moons were hidden from players, events based on the moon cycles would break all events. Now they do not do that anymore. Good moons!

### 1.5a
#### October 11, 2018
* Added - An option to display year day on each day of the year. Check it out in the options tab during creation or editing your calendar.
* Fixed - A bug that causes weather to break if you were view other years than the current one.

### 1.4
#### September 29, 2018
* Tweaked - All saving and editing actions now produce readable errors. I don't know why I didn't do this before but you live and you learn...

### 1.3
#### September 17, 2018
* Fixed - A bug that would cause calendars to not be locally saved while logging in while creating it.

### 1.2
#### September 6, 2018
* Tweaked - Added a warning about missing fields when calendar is complete to lessen confusion by newer users.

### 1.1
#### August 17, 2018
* Tweaked - Weather features on non-rainy days (like dust storms and tornados) will now happen less on non-windy days.
* Fixed - Bug where "every x" events would fail to show up during negative years.
* Fixed - The "To" date in events could not be below the month and day on the "From" date, even if the "To" year was greater than the "From" year, this has now been fixed.

### 1.0
#### May 15, 2018
* Added - Weather systems! You can now generate weather patterns, you can find it in the new tab with a weather icon while editing or creating a calendar.
* Added - You are also able to create your own climates that you can switch between easily.
* Added - Event repetitions every x day/month/year/weekday etc. Check it out in the event creation popup.
* Added - The ability to duplicate entire calendars.
* Fixed - A rare bug that caused the second to last month's length to not load properly.
* Added - Ability to hide upcoming days in the player view. Check the settings for this feature.
* Tweaked - The weather generation system. It works relatively the same, but more chance for wind and clouds on non-rainy/snowy days.
* Fixed - Fixed issue with from/to dates on events not working properly
* Fixed - Fixed an issue with repeating events would not show propetly in subsequent years
* Fixed - Fixed issue when changing the amount of days in a month during calendar generation causing all days to be the current day.
* Fixed - Issue with events in print view not showing the correct month.
* Fixed - An issue where weather would not be visible in player-view.
* Fixed - An issue where the print view would not display the first days correctly.
* Fixed - Small bug with visualization of settings IU.

### 0.90b
#### April 28, 2018
* Added - Event cards - They can be accessed through edit view (to edit/delete events you can be arsed to find) and print view (as index cards).
* Fixed - Made all events use moon index instead of moon name to evaluate events (basically, it means that you can change moon names and moon-based events should not break now).

### 0.87d
#### April 25, 2018
* Fixed - A bug where having spaces in the moon name would cause events to not display.

### 0.87a
#### April 16, 2018
* Fixed - A bug that caused some moons on some calendars to turn to the same color as the dark side of the moon.
* Fixed - A bug that made events appear on all days.

### 0.85c
#### April 13, 2018
* Fixed - Epoch calculation for leap years was broken. Now it is not.
* Fixed - Delete button not working.

### 0.85
#### April 10, 2018
* Tweaked - Network usage vastly improved, and got a new server plan (thanks to our patrons).

### 0.84a
#### April 6, 2018
* Added - You can now color your moons
* Added - Favorite icon, so that it's not a blank lil icon any more.
* Fixed - Some residual bugs related to solstices and changing dates.

### 0.82a
#### April 4, 2018
* Fixed - Bugs with the clock not displaying start and end of day properly.

### 0.82
#### April 3, 2018
* Tweaked - Clock display is now much neater.
* Fixed - Major bug with calendars not showing for viewers (but still worked for owners).

### 0.80a
#### April 2, 2018
* Added - Events can now be created based on moon cycles.
* Tweaked - Reduced the number of moon cycles from 32 to 16 to allow for more accurate event matching.
* Tweaked - Changed first day drop down list to instead change the first day of the first year, creating a cascade effect.
* Fixed - Bug related to leap years where the first day of a year after a leap year would not advance accordingly.
* Fixed - Week numbers not being correct.

### 0.75c
#### March 31, 2018
* Added - Beta feature for leap years. Please report any bugs on the discord channel.
* Added - Warning if you navigate away from an unsaved calendar.

### First public release
