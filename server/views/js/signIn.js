let URL = "/auth/google"

const signIn = new Vue({
el : '#signIn-button',
data: {
    showSignIn: true,
    showSignedInUser: false,
},
methods: {
    signIn : function(){
        console.log("Sign in done");
        try {
            window.location.href = URL;
        } catch (err) {
            alert(`Error has occurred!`);
        }
        this.showSignIn = false;
        this.showSignedInUser = true;
        this.showSignIn = false;
        return 'sucess'
    }
}
})