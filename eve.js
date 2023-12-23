(function($, ElementQueries) {
  document.addEventListener("arlojscontrolsloaded", function() {
    var platformID = "divergenceplus.arlo.co"; // Change platformID to point at your own account

    var filter = {
      moduleType: "Filters",
      targetElement: "#filters",
      template: "#filter-template",
      filterControlId: 1
    };

    var eventList = {
      moduleType: "UpcomingEvents",
      targetElement: "#upcoming-events",
      template: "#upcoming-events-template",
      maxCount: 12,
      filterControlId: 1,
      includeLoadMoreButton: true,
      loadMoreButtonText: "Show More",
      includeArloLink: false,
      smartDateFormats: {
        startDay: "DD"
      },
      customUrls: {
        eventtemplate: "/workshop/",
        venue: "/venue/",
        presenter: "/presenter/"
      },
      callbacks: {
        onShow: eventListOnShowCallback
      }
    };

    var app = new window.ArloWebControls();

    app.start({
      platformID: platformID,
      showDevErrors: false,
      modules: [eventList, filter]
    });
    
    window.loadedFilters = 0;

    /* ----- Callback function ----- */

    // "OnShow" callback
    function eventListOnShowCallback(getEventListItemsFunction) {
      var listItems = getEventListItemsFunction();
      
      var cardSummary = $('.arlo-summary');
      var strMaxLength = 350;
      
      $.each(cardSummary, function (index, ele) {
          var str = $(ele).text()
          $(ele).text(strChopper(str));
      });

      function strChopper(str) {
          if (str.length > strMaxLength) {
              str = str.substring(0, strMaxLength) + '...';
          }
          return str;
      }
      
      ElementQueries.init();

      // Hide timezone selector if there are no online events
      if ($(".arlo-online").length < 1) {
        $(".arlo-timezone-select").hide();
      } else {
        $(".arlo-timezone-select").show();
        $(".arlo-timezone-select").parent().css("float", "right");
      }

      // Set up tooltips
      $.each(listItems, function(index, listItem) {
        var tooltipElement = $(listItem).find('[data-toggle="tooltip"]')[0];
        if (tooltipElement) {
          var toolTipContent = $(listItem).find(".tooltipcontent")[0];
          if (toolTipContent) {
            $(tooltipElement).attr(
              "data-original-title",
              $(toolTipContent).html()
            );
            $(tooltipElement).tooltip();
          }
        }
      });
    }
  });

  window.locationfiltertoggle = function(filter, $) {
    //jshint unused:false
    window.ElementQueries.init();
  };

  window.updateTemplateTagNames = function(filterModel, $) {
    var deleteFilterIndexes = [];
    $.each(filterModel.attributes.Values, function(index, filterValue) {
      switch (filterValue.Label) {
        case "Web_Public":
          filterValue.Label = "Public";
          break;
        case "Web_LiveOnline":
          filterValue.Label = "Live Online";
          break;
        case "Web_PrivateOnsite":
          filterValue.Label = "Private Onsite";
          break;
        case "Web_SelfpacedOnline":
          filterValue.Label = "Self Paced Online";
          break;
        default:
          deleteFilterIndexes.push(index);
      }
    });

    $.each(deleteFilterIndexes, function(index, value) {
      filterModel.attributes.Values.splice(value - index, 1);
    });
  };
  
    window.onFilterLoad = function() {
        if(window.loadedFilters == 0) {
            $("#arlo-filter-toggle").click(function() {
                $(this).parent().toggleClass("arlo-show-filter");
            });
            window.loadedFilters ++;
        }
    };
})(jQuery, window.ElementQueries);
