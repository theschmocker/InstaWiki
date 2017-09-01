var api = 'https://en.wikipedia.org/w/api.php?origin=*&format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=';

var page = 'https://en.wikipedia.org/?curid=';

Vue.component('search-result', {
  props: ['result'],
  template: `
    <section class="result">
      <div>
        <h3>{{ result.title }}</h3>
        <p>{{ result.extract }}</p>
      </div>
        <a :href="'https://en.wikipedia.org/?curid=' + result.pageid" target="_blank" title="Wikipedia Page"><i class="fa fa-wikipedia-w" aria-hidden="true"></i></a>
    </section>
  `
});

var app = new Vue({
  el: '#app',
  data: {
    query: '',
    apiResults: null,
    loading: false,
    failure: false
  },
  watch: {
    query: function() {
      if (this.query !== '') {
        this.loading = true;
        this.search();
      }
    }
    
  },
  methods: {
    search: debounce( function () {
      this.loading = true;
      let url = api + this.query.split(' ').join('+');

      var vm = this;
      axios.get(url).then(response => {
        vm.loading = false;
        vm.apiResults = response.data.query.pages;
      }).catch(err => {
           vm.failure = true;
      });
    }, 500)
  }
})

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};