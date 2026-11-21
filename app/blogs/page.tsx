import Globalbanner from '@/component/global/banner'
import Blog from '@/component/home/blogs'
import React from 'react'

function page() {
  return (
    <div>
            <Globalbanner title="Our Blogs" slug="our blogs" />
            <Blog/>
    </div>
  )
}

export default page
