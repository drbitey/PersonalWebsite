function formatDateFromISO(isoDate, language) {
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC" //JSON consistency
    };

    return new Date(isoDate).toLocaleString(language, options);
}

//Program to calculate # of entries for FAQ
var startDate = new Date("February 5, 2022 00:00:00").getTime(); //get ms value of start date
var now = new Date().getTime(); //get ms value of current date/time
var distance = startDate - now; //find the difference between now and start date. Will be calculated in milliseconds
var days = Math.abs(Math.floor(distance / (1000 * 60 * 60 * 24))); //calculates # of days since start date from ms value. Distance is divided by 86400000, the number of milliseconds in a day. Then it is rounded and the absolute value is taken to remove negative sign and decimals.
document.getElementById("h4_gray_cd").innerHTML = days; //prints in HTML doc, giving the # of days a purple color

const localDate = new Date().toISOString().split("T")[0];
const formattedDate = formatDateFromISO(localDate, "en");

document.getElementById("h4_gray_day").innerHTML = formattedDate;