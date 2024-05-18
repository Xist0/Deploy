import React, { useState } from 'react'
import { PiMessengerLogoLight } from "react-icons/pi";
import { LuSendToBack } from "react-icons/lu";
import { IoMdSend } from "react-icons/io";
import './Messenger.css';

function Messenger() {
    const [Mess, setMess] = useState(false)

    // return (
    //     <div className='messenger-container'>
    //         <div className={Mess ? 'messenger-content, messenger-content-aktive' : 'messenger-content'}>
    //             <div className="messenger-content-filter-nav">
    //                 <h1>1</h1>
    //                 <h1>2</h1>
    //                 <h1>3</h1>
    //             </div>
    //             <div className="messenger-content-main">
    //                 Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quasi enim, quas consequatur sint, cupiditate quidem cumque id veniam odio quam quibusdam officiis vel, distinctio ipsam recusandae? Non laboriosam magnam molestias!
    //                 Itaque, natus quisquam voluptas adipisci vel non, nesciunt nulla laborum sed, sint sapiente nemo quos molestias inventore animi placeat laboriosam praesentium tempora! Itaque eaque excepturi accusantium labore molestias sit consectetur!
    //                 Voluptas illum dolore rerum officia veritatis blanditiis voluptate natus qui aspernatur, odit eius ipsum dignissimos alias quae autem soluta ut delectus impedit fugit! Esse repellat at autem fugiat reprehenderit reiciendis!
    //                 Quis fugit quibusdam saepe, repellendus voluptas suscipit? Itaque voluptatibus esse omnis assumenda voluptatem expedita, incidunt tempora, quasi neque laborum recusandae illum necessitatibus, rerum quo quidem provident? Id perspiciatis saepe voluptatibus!
    //                 Adipisci sequi accusantium sit numquam id ducimus autem cum officia error blanditiis excepturi, aliquid commodi ut soluta expedita incidunt quas nihil alias pariatur temporibus at ex. Alias nihil voluptate delectus.
    //                 Dolores eveniet dolore eum earum ipsum vitae, harum libero error, nisi deleniti natus itaque architecto cum laboriosam, sit culpa provident aperiam? Autem ipsa eligendi nisi ea ad sapiente fugiat assumenda.
    //                 Doloribus placeat illo, adipisci eligendi, accusamus earum obcaecati, molestiae animi omnis ab rerum culpa voluptates eum! Mollitia porro repellendus labore voluptate vero sit necessitatibus placeat? Eum commodi voluptates facere in?
    //                 Quod perferendis corrupti, provident assumenda id corporis, quisquam similique laborum ut nulla eveniet molestiae cupiditate expedita enim dignissimos, odit numquam illum accusamus ex repudiandae labore. Alias qui quas eveniet. Perferendis!
    //                 Repellendus sapiente quaerat sit magnam nisi alias optio magni quod velit, quibusdam recusandae error similique. Magni quam non asperiores laudantium minima temporibus totam deleniti sunt dolor reiciendis. Repellendus, et commodi.
    //                 Reprehenderit dicta, odit quidem sint hic eligendi incidunt dolorem, officia, assumenda maxime doloremque a rem! Suscipit quas necessitatibus optio qui. Optio aliquam est ullam architecto voluptas aperiam laborum perferendis recusandae.
    //             </div>
    //             <div className="messenger-content-header">
    //                 <LuSendToBack />
    //                 <input type="text" />
    //                 <IoMdSend />
    //             </div>
    //         </div>
    //             <PiMessengerLogoLight onClick={() => setMess(!Mess)} />
    //     </div>
    // )
}

export default Messenger