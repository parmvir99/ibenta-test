<template lang="pug">
  div.p-5
    b-button.mb-3(variant="primary", size="md", @click.stop="login", v-if="!token")
      b-spinner(small).button-loader
      span AUTHENTICATE
    div.row.wrap(v-if="token")
      b-col(xl="3", lg="3", cols="6").pr-0.mb-5
        b-card.text-left(:class="{ 'bg-light' : editing }")
          h3.mb-3 {{ editing ? 'Editing User' : 'Create User' }}
          ValidationObserver(ref="createUser")
            b-form#createUserForm(data-vv-scope="createUserForm")
              b-form-group.small(label="User Name")
                ValidationProvider(name="User Name", rules="required", v-slot="{ errors }")
                  b-form-input(no-resize, placeholder="Enter user name", v-model="form.name")
                  small.error.text-danger {{ errors[0] }}

              b-form-group.small(label="Email Address")
                ValidationProvider(name="Email Address", rules="required|email", v-slot="{ errors }")
                  b-form-input(no-resize, placeholder="Enter email address", v-model="form.email", required)
                  small.error.text-danger {{ errors[0] }}

              b-form-group.small(label="First Name")
                ValidationProvider(name="First Name", rules="required", v-slot="{ errors }")
                  b-form-input(no-resize, placeholder="Enter first name", v-model="form.firstName", required)
                  small.error.text-danger {{ errors[0] }}

              b-form-group.small(label="Last Name")
                ValidationProvider(name="Last Name", rules="required", v-slot="{ errors }")
                  b-form-input(no-resize, placeholder="Enter last name", v-model="form.lastName", required)
                  small.error.text-danger {{ errors[0] }}

              b-form-group.small(label="Password")
                ValidationProvider(name="Password", rules="required", v-slot="{ errors }")
                  b-form-input(no-resize, placeholder="Enter password", v-model="form.password", required, type="password")
                  small.error.text-danger {{ errors[0] }}

              div.d-flex
                b-button(variant="primary", size="md", @click.stop="createUser" v-if="!editing")
                  span Submit

                b-button(variant="info", size="md", @click.stop="editUser", v-if="editing")
                  span Edit User

                b-button.ml-auto(variant="warning", size="md", @click.stop="createFive", v-if="!editing", :disabled="loading")
                  span Create 2 Users

                b-button.ml-3(variant="secondary" size="md", @click.stop="cancelEdit", v-if="editing")
                  span Cancel Edit

      b-col(xl="9", lg="9", cols="12").pr-0
        div.d-flex.w-100.align-items-end.mb-2
          div.col.text-left.pl-0
            b-button(variant="danger" size="md", @click.stop="deletePrevUser", :disabled="items.totalElements === 0")
              span Delete User
            p.mb-0.mt-1.text-muted.small This function will delete the previously added user
          div.col.pr-0
            b-pagination.my-0(v-if="items.numberOfElements > 10", v-model='currentPage', :total-rows='totalRows', :per-page='perPage', align='fill' size='sm')
        b-table#userTable(:fields="fields", :items="items.content", :current-page="currentPage", :per-page="perPage" striped, hover, show-empty)
          template(#empty='items')
            h5.text-center No data available, Please create users first.
          template(#cell(actions)='data')
            .d-flex
              b-icon.mr-2(icon="pencil", font-scale="1.5", variant="info", @click.stop="selectEditUser(data.item)")
              b-icon.ml-2(icon="trash", font-scale="1.5", variant="danger", @click.stop="deleteUser(data.item.id)")
</template>

<script>
import { UserApi, Auth } from '@/api'
import { mapGetters } from 'vuex'
export default {
  name: 'test',
  data () {
    return {
      userList: null,
      authToken: null,
      form: {
        name: null,
        email: null,
        firstName: null,
        lastName: null,
        password: null
      },
      fields: [
        {
          key: 'id',
          label: 'User ID',
          formatter: 'id'
        },
        {
          key: 'name',
          label: 'User Name',
          formatter: 'name'
        },
        {
          key: 'firstName',
          label: 'First Name',
          formatter: 'firstName'
        },
        {
          key: 'lastName',
          label: 'Last Name',
          formatter: 'lastName'
        },
        {
          key: 'email',
          label: 'Email',
          formatter: 'email'
        },
        {
          key: 'password',
          label: 'Password',
          formatter: 'password'
        },
        {
          key: 'actions',
          label: '',
          formatter: 'actions'
        },
      ],
      items: [],
      editing: false,
      loading: false,
      currentPage: 0,
      totalRows: 0,
      perPage: 10
    }
  },

  methods: {
    async login () {
      try {
        var ClientOAuth2 = require('client-oauth2')
        var githubAuth = new ClientOAuth2({
          clientId: 'AITWD1zyBVuPWgn4ZBHSREtXJDZXL9Lt',
          clientSecret: 'ELEGpyarKD0OWDrzfiqWqmpkOb4FSKnb',
          accessTokenUri: 'http://authentication-service.jx-ibenta-authentication-service-pr-15.ibenta.com/oauth/token',
          redirectUri: 'http://localhost:8080/#/app/test',
          scope: ['read ', 'write']
        })
        await Auth.authenticate(githubAuth)
      } catch (e) {
        console.log('error', e)
      }
    },
    async createUser () {
      const res = await this.$refs.createUser.validate()
      if (res) {
        try {
          let payload = {
            name: this.form.name,
            firstName: this.form.firstName,
            lastName: this.form.lastName,
            email: this.form.email,
            password: this.form.password
          }
          await UserApi.createUser(payload)
          this.$notify({group: 'notofication', title: 'Well done!', text: 'User successfully created!', type: 'success'})
          this.getUsers()
          this.form = {}
          this.$refs.createUser.reset()
        } catch (e) {
          console.log('error', e)
        }
      }
    },

    selectEditUser (user) {
      this.editing = true
      this.form = user
      document.getElementById('createUserForm').scrollIntoView(false)
    },

    async editUser (id) {
      try {
        const res = await UserApi.editUser(id)
        this.form = res
        this.$notify({group: 'notofication', title: 'Well done!', text: 'User successfully deleted!', type: 'success'})
        this.getUsers()
      } catch (e) {
        console.log('error', e)
      }
    },

    cancelEdit () {
      this.editing = false
      this.getUsers()
      this.form = {}
    },


    async deleteUser (id) {
      try {
        await UserApi.deleteUser(id)
        this.$notify({group: 'notofication', title: 'Well done!', text: 'User successfully deleted!', type: 'success'})
        this.getUsers()
      } catch (e) {
        console.log('error', e)
      }
    },

    async deletePrevUser () {
      const lastUser = this.items.content[this.items.content.length - 1]
      try {
        await UserApi.deleteUser(lastUser.id)
        this.$notify({group: 'notofication', title: 'Well done!', text: 'User successfully deleted!', type: 'success'})
        this.getUsers()
      } catch (e) {
        console.log('error', e)
      }
    },

    async getUsers () {
      try {
        const users = await UserApi.getUsers()
        this.items = users
        this.currentPage = users.totalPages
        this.totalRows = users.totalElements
        console.log('users', users)
      } catch (e) {
        console.log('error', e)
      }
    },

    createFive () {
      this.$notify({group: 'notofication', title: 'Processing!', text: 'Creating 2 users!', type: 'warn'})
      this.loading = true
      document.getElementById('userTable').scrollIntoView(true)
      const n = [1,2]
      n.forEach(n => {
        setTimeout(() => {
          this.createFiveUsers()
          if (n > 1) {
            this.$notify({group: 'notofication', title: 'Well done!', text: '2 Users successfully created!', type: 'success'})
            this.loading = false
          }
        }, n * 2000)
      })
    },

    async createFiveUsers () {
      try {
        let payload = {
          name: 'user name' + Math.floor(Math.random() * (500 - 1 + 1)) + 1,
          firstName: 'first name',
          lastName: 'last name',
          email: `test@gmail.com`,
          password: 'test'
        }
        await UserApi.createUser(payload)
        this.form = {}
        this.getUsers()
      } catch (e) {
        console.log('error', e)
      }
    }
  },
  computed: {
    ...mapGetters({
      token: 'getToken'
    })
  },
  mounted () {
    this.getUsers()
    console.log('this token', this.token)
  }
}
</script>
<style>
  .b-icon {
    cursor:pointer;
  }
  * {
    scroll-behavior: smooth !important;
  }
</style>
