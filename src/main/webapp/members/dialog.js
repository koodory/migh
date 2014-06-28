$(function() {
	var curr = new Date().getFullYear();
	var opt = {
			'date' : {
				preset : 'date',
				invalid : {
					daysOfWeek : [ 0, 6 ],
					daysOfMonth : [ '5/1', '12/24', '12/25' ]
				}
			},
			'datetime' : {
				preset : 'datetime',
				minDate : new Date(2012, 3, 10, 9, 22),
				maxDate : new Date(2014, 7, 30, 15, 44),
				stepMinute : 5
			},
			'time' : {
				preset : 'time'
			},
			'credit' : {
				preset : 'date',
				dateOrder : 'mmyy',
				dateFormat : 'mm/yy',
				startYear : curr,
				endYear : curr + 10,
				width : 100
			},
			'select' : {
				preset : 'select'
			},
			'select-opt' : {
				preset : 'select',
				group : true,
				width : 50
			}
	}

	$('.settings select').bind(
			'change',
			function() {
				var demo = $('#demo').val();

				if (!demo.match(/select/i)) {
					$('.demo-test-' + demo).val('');
				}

				$('.demo-test-' + demo).scroller('destroy').scroller(
						$.extend(opt[demo], {
							theme : $('#theme').val(),
							mode : $('#mode').val(),
							lang : $('#language').val(),
							display : $('#display').val(),
							animate : $('#animation').val()
						}));
				$('.demo').hide();
				$('.demo-' + demo).show();
			});

	$('#demo').trigger('change');
});