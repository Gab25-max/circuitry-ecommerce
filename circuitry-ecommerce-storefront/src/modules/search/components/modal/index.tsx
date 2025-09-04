"use client"

import React, { useEffect, useState } from "react"
import { Hits, InstantSearch, SearchBox } from "react-instantsearch"
import { searchClient } from "../../../../lib/config"
import Modal from "../../../common/components/modal"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

type HitType = {
  objectID: string;
  id: string;
  title: string;
  description: string;
  handle: string;
  thumbnail: string;
}

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      {/* Bottone allineato a destra */}
      <div className="hidden small:flex items-center gap-x-6 h-full ml-auto">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-2xl 
                     border border-gray-300 shadow-sm bg-white 
                     hover:bg-gray-100 hover:shadow-md transition-all duration-200"
        >
          <span className="text-gray-600">🔍</span>
          <span>Cerca</span>
        </button>
      </div>

      {/* Modal con Algolia */}
      <Modal isOpen={isOpen} close={() => setIsOpen(false)}>
        <InstantSearch 
          searchClient={searchClient} 
          indexName={process.env.NEXT_PUBLIC_ALGOLIA_PRODUCT_INDEX_NAME!}
        >
          <SearchBox 
            className="w-full [&_input]:w-[94%] [&_input]:outline-none [&_button]:w-[3%] 
                       [&_input]:rounded-xl [&_input]:border [&_input]:border-gray-300 
                       [&_input]:p-2 [&_input]:shadow-sm [&_input]:focus:border-gray-500" 
          />
          <div className="mt-4 space-y-3">
            <Hits hitComponent={Hit} />
          </div>
        </InstantSearch>
      </Modal>
    </>
  )
}

const Hit = ({ hit }: { hit: HitType }) => {
  return (
    <div className="flex flex-row gap-3 p-3 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition relative bg-white">
      <Image 
        src={hit.thumbnail} 
        alt={hit.title} 
        width={100} 
        height={100} 
        className="rounded-lg object-cover"
      />
      <div className="flex flex-col gap-y-1">
        <h3 className="font-semibold text-gray-800">{hit.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{hit.description}</p>
      </div>
      <Link 
        href={`/products/${hit.handle}`} 
        className="absolute inset-0" 
        aria-label={`View Product: ${hit.title}`} 
      />
    </div>
  )
}
