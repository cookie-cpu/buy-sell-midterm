// $(() => {

//   $('#b1').on('click', onClick);

// });

// const onClick = function(event) {
//   console.log('click');

//   $.ajax({
//     method: 'POST',
//     url: '/messages/:id'
//   }).done((res) => {
//     console.log(res);
//     $('ul').empty();
//     for (item of res.items) {
//       $('<li>').text(item.name).appendTo($('ul'));
//     }
//   });

//   $('#div1').text('123');

// }


//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done((users) => {
//     for(user of users) {
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });;
