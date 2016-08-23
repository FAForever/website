$(document).ready(function() {

    $('.calendar').fullCalendar({

        googleCalendarApiKey: calendar_key,

        eventSources: [
            {
                googleCalendarId: 'faforever.com_ohtfg7lf0pli9k9jj4jopb5i20@group.calendar.google.com',
                className: 'tournamentCalendar'
            },
            {
                googleCalendarId: 'faforever.com_cpellm2p2sdfr8dfmnmgs1davk@group.calendar.google.com',
                className: 'developerCalendar'
            }
        ],

        eventClick: function(event) {
            // opens events in a popup window
            window.open(event.url, 'gcalevent', 'width=700,height=600');
            return false;
        },

        loading: function(bool) {
            $('#loading').toggle(bool);
        }

    });

    $(".toggleSwitch").bootstrapSwitch();

    $(".toggleDeveloper").on('switchChange.bootstrapSwitch', function(event, state) {
        if (state) {
            $(".calendar .developerCalendar").show();
        } else {
            $(".calendar .developerCalendar").hide();
        }
    });

    $(".toggleTournament").on('switchChange.bootstrapSwitch', function(event, state) {
        if (state) {
            $(".calendar .tournamentCalendar").show();
        } else {
            $(".calendar .tournamentCalendar").hide();
        }
    });

});
