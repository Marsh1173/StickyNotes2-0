# make opening the option menu more smooth
    - somehow transition the menu div from 0 height to its current height to make it look like it's opening
# make the sliders in the option box look cooler
# if you click the bottom of the option cog, it opens the menu but it doesn't spin for some reason.
# transfer to typescript


# OTHER DETAILS / BUG FIXES AS THEY'RE NOTICED.




instructions for compiling are found near the end of
    https://merunasgrincalaitis.medium.com/the-ultimate-guide-to-create-desktop-apps-for-javascript-entrepreneurs-4b2e1da0fe9c
    near Section 4. Deploying the App


ONCE DEPLOYED, go to the resources/app/index.js in the new folder
    and change
        fs.writeFileSync('./windowStorage.json', jsonString);
    TO
        fs.writeFileSync('./resources/app/windowStorage.json', jsonString);
    or else it will not save correctly