// SPDX-License-Identifier: GPL
pragma solidity ^0.8.0;

contract MiniBlog {
    //Kolumn Structure
    struct Blog {
        uint256 id;
        string title;
        string content;
        string timestamp;
        uint256 tips;
        address payable author;
    }

    uint256 public blogCount = 0;
    mapping(uint256 => Blog) public blogs;

    //Add a new Kolumn
    function createBlog(
        string memory _title,
        string memory _content,
        string memory _timestamp
    ) public {
        require(msg.sender != address(0x0));
        require(bytes(_title).length * bytes(_content).length > 0);
        blogCount++;
        blogs[blogCount] = Blog(
            blogCount,
            _title,
            _content,
            _timestamp,
            0,
            payable(msg.sender)
        );
    }

    //View Kolumn by ID
    function viewBlog(uint256 _id)
        public
        view
        returns (Blog memory blog)
    {
        blog = blogs[_id];
    }

    //View Latest Columns
    function viewLatestBlogs(uint256 _flag)
        public
        view
        returns (Blog[] memory)
    {
        //Kolumns browsed
        uint256 _localLatest = (_flag - 1) * 10;
        require(blogCount > _localLatest);
        //Start Sending Kolumns from
        _localLatest = blogCount - _localLatest;
        uint256 _counter = 0;
        if (_localLatest > 10) {
            Blog[] memory _latestKolumns = new Blog[](10);
            for (uint256 i = _localLatest; i > (_localLatest - 10); i--) {
                _latestKolumns[_counter] = blogs[i];
                _counter++;
            }
            return _latestKolumns;
        } else {
            Blog[] memory _latestKolumns = new Blog[](_localLatest);
            for (uint256 i = _localLatest; i > 0; i--) {
                _latestKolumns[_counter] = blogs[i];
                _counter++;
            }
            return _latestKolumns;
        }
    }

    //Tip Author
    function sendTip(uint256 _id) public payable {
        blogs[_id].author.transfer(msg.value);
        blogs[_id].tips += msg.value;
    }
}


