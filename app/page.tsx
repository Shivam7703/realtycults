import About from '@/component/home/about'
import Banner from '@/component/home/banner'
import Blog from '@/component/home/blogs'
import WhyChooseUs from '@/component/home/choose'
import Contact from '@/component/home/contact'
import Counter from '@/component/home/count'
import Projects from '@/component/home/project'
import Testimonials from '@/component/home/testimonial'
import React from 'react'

function page() {
  return (
    <div>
      <Banner/>
      <About/>
      <Testimonials/>
            <Projects/>
      <WhyChooseUs/>
      <Counter/>
      <Contact/>
      <Blog/>
    </div>
  )
}

export default page
