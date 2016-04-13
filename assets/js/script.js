$(document).ready(function() {
    
    /* Every time the window is scrolled ... */
    $(window).scroll( function(){
    
        /* Check the location of each desired element */
        $('.timeline-panel grid-block').each( function(i){
            
            var bottom_of_object = $(this).offset().top + $(this).outerHeight();
            var bottom_of_window = $(window).scrollTop() + $(window).height();
            
            /* If the object is completely visible in the window, fade it it */
            if( bottom_of_window > bottom_of_object ){
                
                $(this).animate({'opacity':'1'},500);
                    
            }
            
        }); 
    
    });
    
});
                  $(function () {
                    var api_url_user = "//api.stackexchange.com/2.2/users/{{ site.author.stackoverflow }}/answers?pagesize=5&order=desc&sort=votes&site=stackoverflow";
                    var api_url_format_questions = "//api.stackexchange.com/2.2/questions/%question_ids%?site=stackoverflow";

                    $.get(api_url_user, function (data_user) {
                      if (!data_user) {
                        return;
                      }
                      if (!data_user.items) {
                        return;
                      }
                      if (!data_user.items.length) {
                        return;
                      }

                      var question_ids = [];
                      var complex_questions = {};
                      $.each(data_user.items, function (index, item) {
                        if (!item) {
                          return;
                        }
                        if (!item.question_id) {
                          return;
                        }
                        if (!item.answer_id) {
                          return;
                        }
                        if (!item.score) {
                          return;
                        }

                        complex_questions[item.question_id] = {
                          "question_id": item.question_id,
                          "answer_id": item.answer_id,
                          "score": humanize_score(item.score),
                          "is_accepted": item.is_accepted
                        };
                        question_ids.push(item.question_id);
                      });

                      var api_url_questions = api_url_format_questions.replace('%question_ids%', question_ids.join(';'));

                      $.get(api_url_questions, function (data_questions) {
                        if (!data_questions) {
                          return;
                        }
                        if (!data_questions.items) {
                          return;
                        }
                        if (!data_questions.items.length) {
                          return;
                        }

                        $.each(data_questions.items, function (index, item) {
                          if (!item) {
                            return;
                          }
                          if (!item.question_id) {
                            return;
                          }
                          var complex_question = complex_questions[item.question_id];
                          if (!complex_question) {
                            return;
                          }

                          complex_question.title = item.title;
                          complex_question.link = item.link;
                        });

                        render_complex_questions(complex_questions);
                      });
                    });
                  });
                  function humanize_score(score) {
                    if (!score) {
                      return;
                    }

                    if (score / 1000 > 1) {
                      return (score / 1000) + "k";
                    } else {
                      return score;
                    }
                  }
                  function render_complex_questions(complex_questions) {
                    if (!complex_questions) {
                      return;
                    }

                    complex_questions = $.map(complex_questions, function (complex_question) {
                      return [complex_question];
                    });
                    complex_questions.sort(function (a, b) {
                      return b.score - a.score;
                    });

                    $stackoverflow_questions_and_answers = $('#stackoverflow_questions_and_answers');

                    $.each(complex_questions, function (index, complex_question) {
                      var link = complex_question.link + '#answer-' + complex_question.answer_id;
                      var $li = $('<li />');
                      $('<span />')
                        .addClass('badge')
                        .addClass(complex_question.is_accepted ? 'progress-bar-success' : '')
                        .text(complex_question.score)
                        .appendTo($li);
                      $('<a />')
                        .attr('href', link)
                        .attr('target', '_blank')
                        .text(complex_question.title)
                        .appendTo($li);
                      $li.appendTo($stackoverflow_questions_and_answers);
                    });
                  }