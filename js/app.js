Vue.component('navbar', {
  methods: {
  }
});

Vue.component('search', {
  methods: {
    find: function(e){
      if (e && (e.key == 'Enter' || e.key == null)) {
        App.list();
      }
    }
  }
});

Vue.component('grid', {
  props: ['items', 'offline'],
  methods: {
    like: function(item){
      App.saveLike(item);
    }
  }
});

var router = new VueRouter();

var App = new Vue({
  el: '#vue-app',
  router: router,
  created: function() {
    this.likes = JSON.parse(localStorage.getItem('pwa-likes')) || [];
  },
  beforeMount: function() {
    this.setRoute();
  },
  methods: {
    list: function() {
      var $self = this;
      $self.items = [];

      $.ajax({url: $self.imagesApi + '&q=' + $self.searchField, dataType: 'json'})
      .done(function(json) {
        if (json.hits && json.hits.length) {
          $(json.hits).each(function(index, el) {
            el.liked = false;
            if ($self.isLiked(el)) {
              el.liked = true;
            }

            $self.items.push(el);
          });
        }

        if (json.offline) {
          $self.offline = true;
        } else {
          $self.offline = false;
        }
      });
    },
    listLikes: function() {
      this.items = this.likes;
    },
    saveLike: function(item) {
      if (this.isLiked(item)) {
        var index = this.likes.indexOf(item);
        if (index !== -1) this.likes.splice(index, 1);
        item.liked = false;
      } else {
        this.likes.push(item);
        item.liked = true;
      }

      localStorage.setItem('pwa-likes', JSON.stringify(this.likes));
    },
    isLiked: function(image) {
      return this.likes.filter(x => x.id === image.id).length;
    },
    setRoute: function() {
      if (this.$route.path == '/favoritos') {
        this.listLikes();
      } else {
        this.list();
      }
    }
  },
  watch: {
    searchField: function(text) {
      searchField = text;
    },
    $route: function (to, from) {
      this.setRoute();
    }
  },
  data: function() {
    return {
      items: [],
      offline: false,
      likes: [],
      searchField: '',
      apiParams: {
        key: '10163233-bd34ba2f90890821e4fed4fe3',
        image_type: 'photo',
        per_page: 10
      }
    }
  },
  computed: {
    imagesApi: function() {
      return 'https://pixabay.com/api/?' + $.param(this.apiParams);
    }
  }
});
