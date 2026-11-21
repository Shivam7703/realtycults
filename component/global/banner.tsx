import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

function Globalbanner({title , slug}: {title: string , slug: string}) {
  return (
    <section className='relative w-full h-full'>
       <Image
                src="https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1600&auto=format&fit=crop"
                alt=""
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                className=" object-cover absolute inset-0 -z-10 h-full w-full"
              />
              <div className="bg-black/70 w-full min-h-96 flex items-center flex-col  justify-center p-4">
                <h2 className="text-white text-3xl leading-normal  md:text-6xl font-bold text-center max-w-4xl md:line-clamp-1 pb-2 line-clamp-2">
                  {title}
                </h2>
                <p className="text-white text-xs  lowercase line-clamp-1 max-w-3xl  sm:text-sm font-semibold text-center mt-4 md:mt-8">
                  <Link href="/" className="  hover:text-amber-600 transition-colors duration-300">
                    Home
                  </Link> &nbsp;&gt;&nbsp; {slug}
                </p>
              </div>
    </section>
  )
}

export default Globalbanner
