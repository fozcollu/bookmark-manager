import React, { useState, useEffect } from 'react';

/**
  BookmarkTreeNode
   - children: BookmarkTreeNode;
   - id: number;
   - title: string;
   - url: string;
   - parentId: string 
 */

const Popup = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [keyword, setKeyword] = useState('');

  /* -------------------------------------------------------------------------- */
  /*                                    HOOKS                                   */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    chrome.bookmarks.getTree(function (tree) {
      setBookmarks(tree[0].children || []);
      setFilteredBookmarks(tree[0].children || []);
    });
  }, []);

  useEffect(() => {
    const filteredList = bookmarks.map(copy).filter(function f(o) {
      if (o.children) {
        return (o.children = o.children.map(copy).filter(f)).length;
      } else if (o.title.includes(keyword) || o.url.includes(keyword)) {
        return true;
      }
    });

    setFilteredBookmarks(filteredList);
  }, [keyword]);

  /* -------------------------------------------------------------------------- */
  /*                                   METHODS                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * To not mutate the original,
   * create a map function that copies an object and use that before the filter
   */
  function copy(o) {
    return Object.assign({}, o);
  }

  return (
    <>
      <input
        placeholder="TYPE TO FILTER"
        className="bookmark_search_input"
        value={keyword}
        onChange={e => {
          setKeyword(e.target.value || '');
        }}
      />

      <BookmarkParent nodes={filteredBookmarks} searchedKeyword={keyword} />
    </>
  );
};

export default Popup;

/* -------------------------------------------------------------------------- */
/*                               SUB COMPONENTS                               */
/* -------------------------------------------------------------------------- */

/**
 * Highlights to searched keyword
 */
function getText(text, searchedKeyword) {
  const index = text.indexOf(searchedKeyword);
  console.log(text, ' - ', searchedKeyword, ' - ', index);
  if (searchedKeyword !== '' && index >= 0) {
    return (
      <span>
        {text.substring(0, index)}
        <span style={{ backgroundColor: 'yellow' }}>
          {text.substring(index, index + searchedKeyword.length)}
        </span>
        {text.substring(index + searchedKeyword.length)}
      </span>
    );
  }
  return text;
}

function BookmarkChild({ node, searchedKeyword }) {
  return (
    <div className="bookmark_child_container">
      <span>
        <img
          src={`chrome://favicon/size/16@2x/${node.url}`}
          alt="Avatar"
          className="bookmark_favicon"
        />
      </span>
      <span className="bookmark_child_text_span">
        <a href={node.url} target="blank">
          {getText(node.title || node.url, searchedKeyword)}
        </a>
      </span>
    </div>
  );
}

function BookmarkParent({ nodes, searchedKeyword }) {
  return (
    <>
      {nodes.map(node => (
        <ul>
          {node.children ? (
            node.children.length > 0 && (
              <>
                <h3 className="bookmark_parent_title">
                  {getText(node.title, searchedKeyword)}
                </h3>
                <BookmarkParent
                  nodes={node.children}
                  searchedKeyword={searchedKeyword}
                />
              </>
            )
          ) : (
            <BookmarkChild node={node} searchedKeyword={searchedKeyword} />
          )}
        </ul>
      ))}
    </>
  );
}
