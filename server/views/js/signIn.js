let URL = "/auth/google"
// const router = new VueRouter({
//     routes: [
//         {
//         path: '/login',
//         name: 'login',
//         component: SignInComponent,
//         }
//     ]
// });

const signIn = new Vue({
el : '#signIn-button',
data: {
    showSignIn: true,
    showSignedInUser: false,
},
methods: {
    signIn : function(){
        console.log("Sign in done");
        // alert("Sign-in button clicked")
        try {
            window.location.href = URL;
        } catch (err) {
            alert(`Error has occurred!`);
        }
        this.showSignIn = false;
        
        // GET/POST Request here to fetch user information
        // fetch(URL, {
        //     method: 'GET',
        //     headers: {
        //         'Accept': 'application/json',
        //     },
        // })
        // .then(response => response.text())
        // .then(text => console.log(text))
        this.showSignedInUser = true;
        this.showSignIn = false;
        // return data from get users here (full name)
        // this.$router.push('/login')5
        return 'sucess'
    }
}
})

