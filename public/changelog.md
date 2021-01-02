### 2.0.12 - Celebratory Efreet
#### January 2, 2021
* Fixed - View advanced day data not opening and throwing error

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
