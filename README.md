paper-time-picker
==========
Material Design time picker, compatible with *Polymer 1.0*

Provides a responsive time picker based on the material design spec. This
component aims to be a clone of the time picker introduced in Android Lollipop.

![wide picker screenshot][wide] ![narrow picker screenshot][narrow]

See the [component page](http://bendavis78.github.io/paper-time-picker/) for
full documentation.

## Examples:

Default picker:

```html
<paper-time-picker></paper-time-picker>
```

Setting the initial time to 4:20pm (note that hours given as 24-hour):

```html
<paper-time-picker hour="16" minute="20"></paper-time-picker>
```

If you include this element as part of `paper-dialog`, use the class
`"paper-time-picker-dialog"` on the dialog in order to give it proper styling.

```html
<paper-dialog id="dialog" modal class="paper-time-picker-dialog">
  <paper-time-picker id="timePicker"></paper-time-picker>
  <div class="buttons">
    <paper-button dialog-dismiss>Cancel</paper-button>
    <paper-button dialog-confirm>OK</paper-button>
  </div>
</paper-dialog>
```

---

If you find this component useful, please show your support by donating to
[Bold Idea](http://boldidea.org). Click the button below!

[![ideaSpark campaign button][donate]](https://donorbox.org/bold-idea-make-ideaspark-possible-for-dallas-area-students)

[wide]: http://i.imgur.com/WegKfKT.png
[narrow]: http://i.imgur.com/qybcxQb.png
[donate]: http://www.boldidea.org/donate-badge-md-1.png
