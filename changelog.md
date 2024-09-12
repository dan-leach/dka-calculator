# Changelog

All notable changes to the BSPED Paediatric DKA Calculator codebase will be documented in this file.

See also:

- [API changelog](https://github.com/dan-leach/dka-calculator-api/blob/main/changelog.md)
- [Contributors](https://github.com/dan-leach/dka-calculator/blob/main/contributors.md) to the project.

## [v2.0] - TBC 2024

### Changed

- Total client-side codebase rebuild moving from Vue 2 to Vue 3 Composition with build step. No longer supporting internet explorer. The new build is a single page application with various user interface improvements.
- Calculations of variables for care pathway have now moved to a server-side API call in place of the client-side script. Generation of the care pathway document is still done client-side.
- DKA severity grade selection has changed to include consideration of bicarbonate level. If provided, a severity level will be selected based on both pH and bicarbonate with the more severe option used if these differ.

### Added

- There is now a facility to update limited episode data after submission. This is currently limited to preventable factors, pre-existing diabetes status, end date/time of the DKA protocol, and cerebral oedema questions. This may be expanded in the future to allow retrospective audit data collection.
- A unique patient hash is generated and stored using SHA-256 (x1 client-side, x1 server-side with salt) using patient NHS number and date of birth as input string. This allows episodes relating to the same patient to be linked for audit purposes.
- The patient postcode is collected and sent with other data to the API where an index of multiple deprivation (IMD) decile is derived and stored. The postcode is not stored.
- Bicarbonate, glucose and ketones may now optionally be entered and will be printed on the care pathway if provided. Bicarbonate is used for severity scoring as above.
- Previously a care pathway could be generated even if the diagnostic thresholds for DKA were not met. A check to prevent this has been added. Ketones, if provided, must be above 3 mmol/L. pH must be <= 7.3 or bicarbonate must be < 15 mmol/L. If these thresholds are not met the API will return an error which must be corrected before a care pathway can be generated.
- The patient ethnic group is now collected for audit purposes.
- The insulin delivery method the patient uses (if they have pre-existing diabetes) is now collected for audit purposes.
- Factors that may have contributed to the episode of DKA occuring (preventable factors) are now collected for audit purposes.
- When the patient has pre-existing diabetes ticks are automatically added to the not applicable boxes for ongoing insulin therapy for the mode the patient does not use on flow chart 5.
- Weight limit override confirmation page now includes an option to automatically adjust the weight down to +2SD above mean for age and sex where the provided weight exceeds this value. The page has been simplified where the weight is below the target range to remove warnings about overweight calculations.
- A calculator for corrected sodium and effective osmolality has been added.
- A privacy policy page has been created.

## [v1.3.6] - 2024-03-12 16:00

## Changed

- Security update to fix SQL injection vulnerabilities

## [v1.3.5] - 2022-12-06 08:55

### Removed

- Removed update panel from home page as no clinically significant recent updates

### Added

- Added message at bottom of 'show calculations' panel: "N.B. Insulin should NOT be started immediately. Refer to the BSPED integrated care pathway for how to use these calculated values." in response to feedback.
- Added link to jumbotron 'BSPED 2021 Guidelines' now links to BSPED DKA Guidelines page

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

- Active hyperlinks for generated ICP
- Modal loading popup during ICP generation

## [1.0.4] - 2020-04-21 11:00

- Initial launch for clinical use

## [Pre-release versions]
