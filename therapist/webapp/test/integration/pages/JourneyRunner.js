sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"therapist/test/integration/pages/TherapistsSetList",
	"therapist/test/integration/pages/TherapistsSetObjectPage"
], function (JourneyRunner, TherapistsSetList, TherapistsSetObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('therapist') + '/test/flp.html#app-preview',
        pages: {
			onTheTherapistsSetList: TherapistsSetList,
			onTheTherapistsSetObjectPage: TherapistsSetObjectPage
        },
        async: true
    });

    return runner;
});

