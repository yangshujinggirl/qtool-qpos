import React from 'react';


//button
export function Buttonico({text,fw}) {
    return (
        <div className={fw?'widthmethfw':'widthmeth'}>
            {text}
        </div>
  );
}

export function Buttonicos({text,fw}) {
    return (
        <div className={fw?'widthmethfws':'widthmeths'}>
            {text}
        </div>
  );
}


