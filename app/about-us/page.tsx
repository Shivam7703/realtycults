import Founder from '@/component/about/founder';
import MissionVision from '@/component/about/mission';
import Globalbanner from '@/component/global/banner';
import About from '@/component/home/about';
import React from 'react'

function page() {
  return (
    <div>
      <Globalbanner title="About Us" slug="about us" />
            <About/>
<MissionVision/>
<Founder/>
    </div>
  )
}

export default page;
