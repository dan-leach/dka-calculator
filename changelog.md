# Changelog
All notable changes to this project will be documented in this file.

## [v1.3.4] - 2022-07-21 16:20
### Changed
- Changed severity check function for mild severity from '<' to '<=' mild DKA range upper limit to prevent errors for accepted pH values (6.5 to 7.4).

## [v1.3.3] - 2022-06-13 12:40
### Changed
- Modified custom error for "unable to show working". Now includes additional details in effort to track down occasional error occuring here.

## [v1.3.2] - 2022-06-03 09:00
### Added
- Added browser-update.org pop-up in consideration of forthcoming IE retirement date

## [v1.3.1] - 2022-05-30 16:20
### Changed
- Custom errors now thrown as objects rather than strings to include stack for debugging

## [v1.3.0] - 2022-05-16 10:00
### Added
- Added history.replaceState to maintenance page so that refresh reattempts loading start page
### Changed
- Updated update notification panel
- Replaced blank downloadable ICP document with v1.3
- Updated calculator generated front page image with v1.3 and reposition superimposed text
- Updated wording for making up IV fluids to match v1.3 ICP
### Removed
- Retired legacy version 1.1.10 (placeholder/redirect page remains for now)

## [v1.2.3] - 2022-03-16 09:30
### Changed
- Updated error handler to test for local storage capability to investigate if occasional errors are caused by unavailability of local storage
- Updated error.php to use htmlspecialchars() rather than FILTER_SANITIZE_STRING which is now deprecated
### Removed
- Removed debug page as functionality now included with error handler

## [v1.2.2] - 2022-01-24 09:00
### Changed
- Inserting audit data into database now uses prepared statements to fix bug when treating centre had apostraphe in name
- Updated signpost documents to match 2021 guidance
- Updated links to BSPED to new DKA guidelines page URL

## [v1.2.1] - 2021-11-29 11:23
### Added
- List of Scottish hospitals to centre list
- Added error.php and now emails notification of any errors to admin
## Changed
- Grammar error corrected in weight safety limit override modal

## [v1.2.0] - 2021-11-25 18:36
### Added
- All calculated values now limited by maximum weight of 75kg
-- Capped bolus volume to 750ml
-- Capped deficit volume to 7500ml if 10% dehydrated
-- Capped deficit volume to 3750ml if 5% dehydrated
-- Capped insulin rate to 7.5 Units/hour if using 0.1 Units/kg/hour
-- Capped insulin rate to 3.75 Units/hour if using 0.05 Units/kg/hour
-- Capped maintenance daily fluid volume unchanged to 2600ml
- Warning notice applied to ICP where bolus, deficit, maintenance or insulin cap has been applied
- Dagger indicator added to show working to indicate capped values
- Each submission now records calculator version in database
- New form input for episode type to distinguish between new episodes, redo protocols, and test/training purposes - new column in database to store this
- Calculator logo to header
- Prevented submission errors caused by refreshing submit page by replacing URL in address bar to start page
- Link to danleach.uk in footer
- Link to changelog in footer
- Temporary update panel regarding changes with new guideline
- Check isset for overrideCheckbox in submit.php to prevent non-fatal PHP error
- Check isset for protocolStart in submit.php to prevent non-fatal PHP errors
- Force clear form on index page load to prevent weight checking error when navigated to using back
- Access to legacy v1.1.10 (will be removed after 6 month transition period)
- Commenting throughout
- Error handling and logging for client side errors, plus user notification about errors
### Changed
- Deficit percentage for moderate DKA reduced from 7% to 5%
- 1st resus bolus volume reduced from 20ml/kg to 10ml/kg
- Resus bolus section now includes space for 4th resus bolus to keep total 40ml/kg total despite reduced initial bolus volume
- Recommended upper limit for weight reduced from 80kg to 75kg
- Audit ID method now generates shorter unique ID which is checked against database to confirm unique
- Changed positioning of demographics on ICP front page due to shorter audit ID
- Old plain text version log replaced with new markdown changelog
- Audit ID is added automatically to form, without needing to click 'generate audit id' button
- Shape of DKA severity selector box changed to fit new flow chart shape that combines mild and moderate severity into a single deficit percentage
- Refactored calcVars.js and docDef.js
- Consolidated index components into index.js
- Consolidated showWorking.js into submit.js
- Improved appearance of protocol generation loading modal
- Improved appearance of show working
- Improve appearance of submit page action buttons
### Removed
- Example calculation formulae on fluids page to allow space for capped volume warnings

## [1.1.10] - 2021-06-04 16:22
### Changed
- Updated hospitals list to removed Nevill Hall and Royal Gwent Hospitals, replaced by Grange University Hospital

## [1.1.9] 2021-02-05 14:15
### Changed
- Disclaimer modal now has to be accepted to reach start page

## [1.1.8] - 2020-08-27 11:15
### Changed
- Updated hospitals list to include Ulster Hospital Dundonald in list of NI hospitals

## [1.1.7] - 2020-06-10 18:30
### Added
- CE mark

## [1.1.6] - 2020-06-02
### Added
- ICP now includes signpost to online disclaimer
### Changed
- Disclaimer now appears as modal popup

## [1.1.5] - 2020-05-29 19:35
### Changed
- Updated disclaimer wording

## [1.1.4] - 2020-05-13 14:35
### Changed
- Updated disclaimer wording

## [1.1.3] - 2020-05-12 16:30
### Added
- Mobile-friendly page with redirect from index.php

## [1.1.2] - 2020-05-12 14:12
### Added
- Sitemap
- Minor SEO meta

### Changed
- Spelling corrections
- Versioning method changed to versioned js directory name to ensure no persisting cache of old js

## [1.1.1] - 2020-05-11 15:40
### Changed
- Disclaimer updated

## [1.1.0] - 2020-04-22 00:05
### Added
- Active  hyperlinks for generated ICP
- Modal loading popup during ICP generation 

## [1.0.4] - 2020-04-21 11:00
- Initial launch for clinical use

## [Pre-release versions]