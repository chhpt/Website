$( ".appender" ).each(function( index ) {
  $this = $( this );
  
  $this.find('.read-more, .close').click( function(){
    $this.find('.appended-content').slideToggle(500);
    $this.toggleClass('inactive active');
  });
 
});
