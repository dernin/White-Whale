import Layout from "../components/layout";
import Block from "../components/block";
import FormField from "../components/formField";
import FieldButton from "../components/fieldButton";
import React from "react";
<<<<<<< HEAD
import { getData } from "../lib/util";
=======
>>>>>>> origin/txtsearch
import { strip } from "../lib/util";

export async function getStaticProps() {
    //sendEmail('devinjamescurtis@gmail.com', 'A New Message From White Whale', 'Test Message').catch(console.error)
    
    
    return {
        props: {

        }
    }
}

export default class Contact extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            name: '',
            nameError: '',
            email: '',
            emailError: '',
            message: '',
            messageError: '',
            messageSent: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        const target = event.target
        const name = target.name
        const value = target.value

        this.setState({
            [name]: strip(value),
            ['nameError']: '',
            ['emailError']: '',
            ['messageError']: ''
        })
    }

    async handleSubmit(event) {
        event.preventDefault()
        if (this.state.name === '') {
            this.setState({
                ['nameError']: 'Please enter your name',
            })
            return
        }
        else if (this.state.email === '') {
            this.setState({
                ['emailError']: 'Please enter a valid email address',
            })
            return
        }
        if (this.state.message === '') {
            this.setState({
                ['messageError']: 'Please enter a message'
            })
            return
        }
        else {
            const apiString = '/api/email?name=' + this.state.name + '&email=' + this.state.email + '&message=' + this.state.message
            const data = await fetch(apiString, { mode: 'cors' })
            console.log('api ran')
            this.setState({
                ['name']: '',
                ['nameError']: '',
                ['email']: '',
                ['emailError']: '',
                ['message']: '',
                ['messageError']: '',
                ['messageSent']: true
            })
        }


    }
    render () {
    return (
        <Layout>
            <div className="section container color-bg">
                <h2 className="title is-2">Contact</h2>
                <Block>If there are features or authors you would like to see added, please use the form below.</Block>
                {!this.state.messageSent &&
                <form className="contact-form" onSubmit={this.handleSubmit}>
                    <div className="columns">
                        <div className="column">
                    <FormField label="Name" element="input" type="text" placeholder="Your Name" name="name" onChange={this.handleChange} error={this.state.nameError} />
                    </div>
                    <div className="column">
                    <FormField label="Email" element="input" type="email" placeholder="example@domain.com" name="email" onChange={this.handleChange} error={this.state.emailError} />
                    </div>
                    </div>
                    <FormField label="Message" element="textarea" placeholder="Your Message Here" name="message" onChange={this.handleChange} error={this.state.messageError} />
                    <FieldButton className="is-link is-medium" text="Submit" type="submit" value="submit" />
                </form>
                }
                {this.state.messageSent &&
                <div className="container has-text-info">Your message has been sent. Thank you!</div>}
            </div>
        </Layout>
    )
}
}