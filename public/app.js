
$.getJSON('/articles', (data) => {
  for (let i = 0; i < data.length; i++) { // eslint-disable-line
    console.log(i);
    $('#articles').append(
      `<p data-id='${data[i]._id}'>${data[i].title}<br />${data[i].link}<br />Summary: ${data[i].summary}</p>`, // eslint-disable-line
    );
  }
});


$(document).on('click', '#scraper', () => { // parenthesis needed?
  $.ajax({
    method: 'GET',
    url: '/scrape',
  })
    .then(location.reload()); // eslint-disable-line
});

// Getting notes
$(document).on('click', 'p', function () {
  $('#notes').empty();
  const thisId = $(this).attr('data-id');
  $.ajax({
    method: 'GET',
    url: `/articles/${thisId}`,
  })
    .then((data) => { // data is path including id
      console.log('Getting notes');
      console.log(data);
      $('#notes').append(`<h2>${data.title}</h2>`);
      $('#notes').append("<input id='titleinput' name='title' >");
      $('#notes').append("<textarea id='bodyinput' name='body'></textarea>");
      $('#notes').append(`<button data-id='${data._id}' id='savenote'>Save Note</button>`); // eslint-disable-line

      if (data.note) {
        $('#titleinput').val(data.note.title);
        $('#bodyinput').val(data.note.body);
      }
    });
});

// SAVE NOTES
// When you click the savenote button
$(document).on('click', '#savenote', function () {
  const thisId = $(this).attr('data-id');
  $.ajax({
    method: 'POST',
    url: `/articles/${thisId}`,
    data: {
      title: $('#titleinput').val(),
      body: $('#bodyinput').val(),
    },
  })
    .then((data) => {
      console.log('Saving note');
      console.log(data);
      $('#notes').empty();
    });

  $('#titleinput').val('');
  $('#bodyinput').val('');
});
