Template.post.onCreated(function() {
  this.searchQuery = new ReactiveVar('');
  this.filter = new ReactiveVar('all');
  this.limit = new ReactiveVar(20);
  Session.set('imageSrc', null);
  this.autorun(() => {
    this.subscribe('posts.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
    this.subscribe('profilePhotos.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
  });
});

Template.post.events({
  'click [data-id=remove-post]': function(event, template) {
    let self = this;

    // Sweet Alert delete confirmation
    swal({
      title: 'Delete post?',
      text: 'Are you sure that you want to delete this post?',
      type: 'error',
      showCancelButton: true,
      closeOnConfirm: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#da5347'
    }, function() {
      Meteor.call('posts.remove', self._id, (error, result) => {
        if (error) {
          Bert.alert(error.reason, 'danger', 'fixed-top');
        } else {
          Bert.alert('Post successfully removed', 'success', 'fixed-top');
        }
      });
    });
  },
  'click [data-id=like-post]': function(event, template) {
    let self = this;

    Meteor.call('posts.like', self._id, (error, result) => {
      if (error) {
        Bert.alert(error.reason, 'danger', 'fixed-top');
      }
    });
  }
});

Template.post.helpers({
  author: function() {
    return Meteor.users.findOne({ _id: this.authorId });
  },
  profileImage: function(){
      var photo = ProfilePhotos.findOne({ authorId: this.authorId  });
      return photo.url;
  },
  belongsPostToUser: function() {
    return this.authorId === Meteor.userId();
  },
  formatDate: function(date) {
    let currDate = moment(new Date()),
        msgDate = moment(new Date(date));

    let diff = currDate.diff(msgDate, 'days');

    if (diff === 0 && currDate.day() === msgDate.day()) {
      let hourDiff = currDate.diff(msgDate, 'hours'),
          minDiff = currDate.diff(msgDate, 'minutes');
      if (hourDiff > 0) {
        if (hourDiff === 1) {
          return (hourDiff + ' hr');
        } else {
          return (hourDiff + ' hrs');
        }
      } else if (minDiff > 0) {
        if (minDiff === 1) {
          return (minDiff + ' min');
        } else {
          return (minDiff + ' mins');
        }
      } else {
        return 'Just now';
      }
    } else if (diff <= 1 && currDate.day() !== msgDate.day()) {
      return ('Yesterday at ' + moment(date).format('h:mm a'));
    } else {
      if (currDate.year() !== msgDate.year()) {
        return moment(date).format('MMMM DD, YYYY');
      } else {
        return (moment(date).format('MMMM DD') + ' at ' + moment(date).format('h:mm a'));
      }
    }
  },
  isLiked: function() {
    if (Posts.find( { _id: this._id, already_voted: { $in: [Meteor.userId()]} }).count() === 1) {
      return 'liked';
    }
    return '';
  }
});
