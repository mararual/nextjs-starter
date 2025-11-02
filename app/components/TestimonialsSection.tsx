type Testimonial = {
  readonly id: string
  readonly author: string
  readonly company: string
  readonly text: string
  readonly image?: string
}

type TestimonialsSectionProps = {
  readonly testimonials?: readonly Testimonial[]
}

const defaultTestimonials: readonly Testimonial[] = [
  {
    id: '1',
    author: 'Sarah Anderson',
    company: 'Tech Innovations Inc',
    text: 'This product has completely transformed how our team works. The performance improvements alone have saved us countless hours each week.',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    id: '2',
    author: 'Michael Chen',
    company: 'Digital Ventures',
    text: 'The seamless integration with our existing tools made adoption effortless. Customer support has been exceptional throughout our journey.',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
  },
  {
    id: '3',
    author: 'Emily Rodriguez',
    company: 'Growth Labs',
    text: 'Scaling our operations became so much easier. The reliability and security features give us peace of mind to focus on growth.',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
  },
]

export function TestimonialsSection({ testimonials = defaultTestimonials }: TestimonialsSectionProps) {
  return (
    <section className="py-20 sm:py-32 bg-white" data-testid="testimonials-section">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by leading teams
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            See what our customers have to say about their experience
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map(testimonial => (
            <div
              key={testimonial.id}
              className="relative rounded-lg border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
              data-testid="testimonial"
            >
              <div className="flex items-center gap-4 mb-6">
                {testimonial.image && (
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="h-12 w-12 rounded-full"
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.company}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-600 leading-relaxed">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
