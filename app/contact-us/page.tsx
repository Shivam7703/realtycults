import ContactUs from '@/component/contact/detail'
import ContactMap from '@/component/contact/map'
import Globalbanner from '@/component/global/banner'
import React from 'react'

function page() {
  return (
    <div>
            <Globalbanner title="Contact Us" slug="contact us" />
            <ContactUs/>
            <ContactMap/>
    </div>
  )
}

export default page
